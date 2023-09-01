import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResizableTextOverlay from './Text';
import './home.css';

const API_KEY = 'a_3PX2oxMMcIYI6pOFE7gxFGeymc_95CuKFy1xWxkWE';

const Home = () => {
  const [showImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAddTextButton, setShowAddTextButton] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textOverlays, setTextOverlays] = useState([]);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    if (showImages) {
      const fetchImages = async () => {
        try {
          const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
              count: 8,
            },
            headers: {
              Authorization: `Client-ID ${API_KEY}`,
            },
          });
          setSelectedImage(null);
          setShowAddTextButton(false);
          setTextOverlays([]);
          setImageList(response.data);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };

      fetchImages();
    }
  }, [showImages]);

  const handleImageClick = (imageURL) => {
    setSelectedImage(imageURL);
    setShowAddTextButton(true);
  };

  const handleAddText = () => {
    if (textInput.trim() !== '') {
      setTextOverlays([...textOverlays, textInput]);
      setTextInput('');
    }
  };

  const handleTextChange = (index, newText) => {
    const updatedTextOverlays = [...textOverlays];
    updatedTextOverlays[index] = newText;
    setTextOverlays(updatedTextOverlays);
  };
 
  const handleShowImages = () => {
    setSelectedImage(null);
    setShowAddTextButton(false);
    setTextOverlays([]);
  };
  const handleDownloadImage = () => {
    if (selectedImage) {
      const canvasWidth = 600;
      const canvasHeight = 400;
  
      const canvas = document.createElement('canvas');
      const image = new Image();

      
  
      image.crossOrigin = 'anonymous';
      image.src = selectedImage;
  
      image.onload = () => {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
  
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
  
       
        context.fillStyle = 'white';
        context.font = '50px inter';
        textOverlays.forEach((text, index) => {
          const textX = 200;
          const textY = canvasHeight - 190 * (index + 1);
          context.fillText(text, textX, textY);
        });
  
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'image_with_text.png';
        link.click();
      };
    }
  };
  

  return (
    <div className="app">
      <div className="box-1">
        {!selectedImage && !showImages && (
          <button className='add-btn' onClick={() => setShowImages(true)}>Add Image</button>
        )}
      </div>

      {showImages && !selectedImage && (
        <div className="box-2">
          <h1>Select an Image</h1>
          <div className="image-list grid-container">
            {imageList.map((image, index) => (
              <img
                className="images"
                key={index}
                src={image.urls.thumb}
                alt={`Unsplash ${index}`}
                onClick={() => handleImageClick(image.urls.regular)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="selected-image-1">
          <div className="image-with-text">
            <img className="selected-image" src={selectedImage} alt="Selected from Unsplash" />
            {showAddTextButton && (
              <div className="text-input">
               
                <div className='buttons'>
                                  <div>
                                      <input
                                          className='text-input-1'
                                          type="text"
                                          value={textInput}
                                          onChange={(e) => setTextInput(e.target.value)}
                                      />
                                      <button className='add-btn-1' onClick={handleAddText}>Add Text</button>

                                  </div>
                
                   <button className='add-btn-2' onClick={handleShowImages}>Select Another Image</button>
                   <button className='add-btn-2' onClick={handleDownloadImage}>Download</button>
                </div>
                
              </div>
            )}
            <div className="text-overlays">
              {textOverlays.map((text, index) => (
                <ResizableTextOverlay
                  key={index}
                  text={text}
                  index={index}
                  onChangeText={handleTextChange}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
