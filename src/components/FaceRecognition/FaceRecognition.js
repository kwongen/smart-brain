import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) => {
	if (imageUrl === undefined || imageUrl.length === 0) {
		return (
			<div className="center f2 yellow b">
				<p>No photo</p>
			</div>
		)
	} else if(box.length ===0) {
		return (
			<div className="center ma">
				<div className="absolute mt2">
					<img id='inputImage' alt='people' src={ imageUrl } width="500px" height="auto"/>
					<div className="over-image-centered f2 white b" >No face found</div>
				</div>
			</div>	
		)
	} else {
		const faceBoxes = [];
		box.forEach((item, i) => faceBoxes.push(<div key={`facebox${i}`} className='bounding-box' 
												style={{top: item.topRow, right: item.rightCol, bottom: item.bottomRow, left: item.leftCol}} ></div>));

		return (
			<div className="center ma">
				<div className="absolute mt2 ">
					<img id='inputImage' alt='people' src={ imageUrl } width="500px" height="auto"/>
					{/*<div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>*/}
					{faceBoxes}
				</div>
				<div className="mb5"></div>
			</div>
		);
	}
}

export default FaceRecognition;