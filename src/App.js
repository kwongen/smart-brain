import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';
import 'tachyons';
import ParticlesBg from 'particles-bg'

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '79c2e9a2c2ec4eab8e5b6d95223f0332';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = '6zn3arjp344j';
const APP_ID = 'smart-brain-app';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';

const initalState = {
  input : '',
  imageUrl : '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '', 
    name:'', 
    email:'', 
    entries: 0, 
    joined: ''
  }
};

class App extends Component {
  constructor () {
    super();
    this.state = {
      input : '',
      imageUrl : '',
      box: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '', 
        name:'', 
        email:'', 
        entries: 0, 
        joined: ''
      }
    }
  }
  
  // componentDidMount() {
  //   fetch('http://localhost:3001')
  //   .then(response => response.json())
  //   //.then(data => console.log(data))
  //   .then(console.log);
  // }

  loadUser = (data) => {
    this.setState({
        input : '',
        imageUrl : '',
        box: [],       
        user: {
          id: data.id, 
          name: data.name, 
          email: data.email, 
          entries: data.entries, 
          joined: data.joined
          }     
    })

  }
  
  calculateFaceLocation = (data) => {
    if(data.outputs[0].data.regions === undefined || data.outputs[0].data.regions.length === 0) {
      console.log("no face detected");
      return [];
    }

    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    //const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const faceLocationArray = [];

    data.outputs[0].data.regions.forEach( (item) => {
      const clarifaiFace = item.region_info.bounding_box;
      faceLocationArray.push( {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)     
      })
    });

    return faceLocationArray;

    // return {
    //   leftCol: clarifaiFace.left_col * width,
    //   topRow: clarifaiFace.top_row * height,
    //   rightCol: width - (clarifaiFace.right_col * width),
    //   bottomRow: height - (clarifaiFace.bottom_row * height)
    // }
  }
   

  displayFaceBox = (box) => {
    this.setState({box : box});
  }

  onInputChange = (event) => {
    this.setState({input : event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl : this.state.input});
    this.setState({box : []});

    fetch(`${process.env.REACT_APP_API_BASE_URL}/face-detection`, {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({imageUrl: this.state.input})
      })
      .then(response => response.json())
      .then(api_result => {
        if(api_result) {
          fetch(`${process.env.REACT_APP_API_BASE_URL}/image`, {
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({id: this.state.user.id})
          })
          .then(response => response.json())
          .then(result => {
              this.setState(Object.assign(this.state.user, {entries: result.entries}))
          })
          .catch(error => console.log('error', error));
        }
        this.displayFaceBox(this.calculateFaceLocation(api_result))
      })
      .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if( route === 'signin' || route === 'signout') {
      this.setState(initalState);
    } else if( route === 'home' ) {
       this.setState({isSignedIn: true});     
    }
    
    this.setState({route: route});
  }

  render () {
    const {isSignedIn, imageUrl, route, box} = this.state;

    return (
      <div className="App">
        <p>API URL: {process.env.REACT_APP_API_BASE_URL}</p>
        <ParticlesBg type="cobweb" color="#ff0000" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home'
        ?  <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} 
                           onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        : (
            this.state.route === 'signin' || this.state.route === 'signout'
            ? <Signin   loadUser={this.loadUser} onRouteChange={this.onRouteChange} />       
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />      
          )
        }
      </div>
    )
  }
}

export default App;
