import { useState, useEffect } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('my-images'); // 'my-images' or 'shared-access'
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Load user's images on component mount
  useEffect(() => {
    if (account && contract) {
      loadMyImages();
    }
  }, [account, contract]);

  const loadMyImages = async () => {
    if (!account || !contract) return;
    
    setLoading(true);
    try {
      const dataArray = await contract.display(account);
      let metadataArray = [];
      
      try {
        metadataArray = await contract.getFilesWithMetadata(account);
      } catch (e) {
        console.log("Metadata not available");
      }
      
      processImageData(dataArray, metadataArray);
    } catch (e) {
      console.error("Error loading images:", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSharedImages = async (address) => {
    if (!contract || !address) return;
    
    setLoading(true);
    try {
      const dataArray = await contract.display(address);
      let metadataArray = [];
      
      try {
        metadataArray = await contract.getFilesWithMetadata(address);
      } catch (e) {
        console.log("Metadata not available for this user");
      }
      
      processImageData(dataArray, metadataArray);
    } catch (e) {
      alert("You don't have access to this user's images");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const processImageData = (dataArray, metadataArray) => {
    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      
      const images = str_array.map((item, i) => {
        const metadata = metadataArray[i];
        const imageUrl = item.startsWith('https://') ? item : `https://gateway.pinata.cloud/ipfs/${item.substring(6)}`;
        
        return {
          id: i,
          url: imageUrl,
          metadata: metadata,
          originalHash: item
        };
      });
      
      setData(images);
    } else {
      setData([]);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'my-images') {
      loadMyImages();
    } else {
      setData([]);
      setSearchAddress('');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      loadSharedImages(searchAddress.trim());
    }
  };
  return (
    <div className="gallery-section">
      {/* Gallery Header */}
      <div className="gallery-header">
        <h2 className="section-title">🖼️ Image Gallery</h2>
        
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'my-images' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('my-images')}
          >
            📁 My Images
          </button>
          <button 
            className={`view-btn ${viewMode === 'shared-access' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('shared-access')}
          >
            👥 Shared Access
          </button>
        </div>
      </div>

      {/* Search for shared images */}
      {viewMode === 'shared-access' && (
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Enter wallet address to view shared images..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={!searchAddress.trim()}>
            🔍 View Images
          </button>
        </form>
      )}

      {/* Loading state */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading images...</p>
        </div>
      )}

      {/* Image Grid */}
      {!loading && data.length > 0 && (
        <div className="image-grid">
          {data.map((image) => (
            <div key={image.id} className="image-card" onClick={() => setSelectedImage(image)}>
              <div className="image-container">
                <img src={image.url} alt="Uploaded file" className="gallery-image" />
                <div className="image-overlay">
                  <div className="overlay-content">
                    {image.metadata && (
                      <>
                        <p className="image-filename">📁 {image.metadata.fileName}</p>
                        <p className="image-date">📅 {new Date(image.metadata.timestamp * 1000).toLocaleDateString()}</p>
                        <p className="image-location">
                          📍 {image.metadata.location || `${image.metadata.latitude}, ${image.metadata.longitude}`}
                        </p>
                      </>
                    )}
                    <button className="view-full-btn">👁️ View Full Size</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && data.length === 0 && viewMode === 'my-images' && (
        <div className="empty-state">
          <div className="empty-icon">📸</div>
          <h3>No images yet</h3>
          <p>Upload your first image to get started!</p>
        </div>
      )}

      {!loading && data.length === 0 && viewMode === 'shared-access' && searchAddress && (
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h3>No access or no images</h3>
          <p>You don't have access to this user's images, or they haven't uploaded any.</p>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage.url} alt="Full size" className="modal-image" />
            {selectedImage.metadata && (
              <div className="modal-metadata">
                <h3>📁 {selectedImage.metadata.fileName}</h3>
                <p>📅 {new Date(selectedImage.metadata.timestamp * 1000).toLocaleString()}</p>
                <p>📍 {selectedImage.metadata.location || `${selectedImage.metadata.latitude}, ${selectedImage.metadata.longitude}`}</p>
                <a href={selectedImage.url} target="_blank" rel="noopener noreferrer" className="open-link">
                  🔗 Open in New Tab
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Display;
