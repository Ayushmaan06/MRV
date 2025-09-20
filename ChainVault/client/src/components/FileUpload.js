import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [location, setLocation] = useState({ latitude: "", longitude: "", address: "" });
  const [locationPermission, setLocationPermission] = useState("pending");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Get user's geolocation when component mounts (silently in background)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(prev => ({ ...prev, latitude: latitude.toString(), longitude: longitude.toString() }));
          setLocationPermission("granted");
          
          // Get readable address using free reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            const data = await response.json();
            if (data && data.display_name) {
              setLocation(prev => ({ ...prev, address: data.display_name }));
            } else {
              setLocation(prev => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
            }
          } catch (error) {
            console.log("Could not get address:", error);
            setLocation(prev => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          }
        },
        (error) => {
          console.log("Geolocation error:", error);
          setLocationPermission("denied");
          setLocation({ latitude: "0", longitude: "0", address: "Location not available" });
        }
      );
    } else {
      setLocationPermission("not-supported");
      setLocation({ latitude: "0", longitude: "0", address: "Geolocation not supported" });
    }
  }, []);

  const handleUpload = async () => {
    if (!file || !account) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      setUploadProgress(30);
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
      });
      
      setUploadProgress(70);
      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      
      // Upload with metadata including timestamp and geolocation
      try {
        await contract.addFileWithMetadata(
          account,
          ImgHash,
          location.latitude,
          location.longitude,
          location.address,
          fileName
        );
        setUploadProgress(100);
        
        // Success notification
        setTimeout(() => {
          setFile(null);
          setFileName("");
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
        
      } catch (error) {
        console.log("Smart contract error, falling back to basic upload:", error);
        await contract.add(account, ImgHash);
        setUploadProgress(100);
        
        setTimeout(() => {
          setFile(null);
          setFileName("");
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
      }
      
    } catch (e) {
      console.error("Upload failed:", e);
      setIsUploading(false);
      setUploadProgress(0);
      alert("Upload failed. Please try again.");
    }
  };
  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="upload-section">
      <div className="upload-header">
        <h2 className="section-title">📤 Upload Image</h2>
        <div className="metadata-status">
          {locationPermission === "granted" && (
            <span className="status-indicator success">📍 Location enabled</span>
          )}
          {locationPermission === "denied" && (
            <span className="status-indicator warning">📍 Location disabled</span>
          )}
          <span className="status-indicator info">⏰ Auto-timestamped</span>
        </div>
      </div>

      <div 
        className={`upload-dropzone ${isDragOver ? 'drag-over' : ''} ${!account ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!account ? null : openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={!account}
        />
        
        {!account ? (
          <div className="upload-message">
            <div className="upload-icon">🔒</div>
            <p>Connect your wallet to upload images</p>
          </div>
        ) : file ? (
          <div className="file-selected">
            <div className="file-preview">
              <img 
                src={URL.createObjectURL(file)} 
                alt="Preview" 
                className="preview-image"
              />
            </div>
            <div className="file-info">
              <p className="file-name">{fileName}</p>
              <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              {locationPermission === "granted" && (
                <p className="location-info">📍 {location.address}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="upload-message">
            <div className="upload-icon">📸</div>
            <p>Drag & drop an image here</p>
            <span>or click to browse</span>
          </div>
        )}
      </div>

      {file && (
        <div className="upload-actions">
          <button 
            className="upload-btn"
            onClick={handleUpload}
            disabled={isUploading || !account}
          >
            {isUploading ? (
              <>
                <span className="loading-spinner"></span>
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                🚀 Upload to Blockchain
              </>
            )}
          </button>
          
          <button 
            className="clear-btn"
            onClick={() => {
              setFile(null);
              setFileName("");
            }}
            disabled={isUploading}
          >
            Clear
          </button>
        </div>
      )}

      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FileUpload;

// import { useState } from "react";
// import axios from "axios";
// import "./FileUpload.css";
// function FileUpload({ contract, provider, account }) {
//   // const [urlArr, setUrlArr] = useState([]);
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("No image selected");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (file) {
//         try {
//           const formData = new FormData();
//           formData.append("file", file);

//           const resFile = await axios({
//             method: "post",
//             url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//             data: formData,
//             headers: {
//               pinata_api_key: `95f328a012f1634eab8b`,
//               pinata_secret_api_key: `8ea64e6b39c91631c66128a7c0e0dde35a6fbdf797a8393cc5ba8bf8d58e9b54`,
//               "Content-Type": "multipart/form-data",
//             },
//           });

//           const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
//           const signer = contract.connect(provider.getSigner());
//           signer.add(account, ImgHash);

//           //setUrlArr((prev) => [...prev, ImgHash]);

//           //Take a look at your Pinata Pinned section, you will see a new file added to you list.
//         } catch (error) {
//           alert("Error sending File to IPFS");
//           console.log(error);
//         }
//       }

//       alert("Successfully Uploaded");
//       setFileName("No image selected");
//       setFile(null); //to again disable the upload button after upload
//     } catch (error) {
//       console.log(error.message); //this mostly occurse when net is not working
//     }
//   };
//   const retrieveFile = (e) => {
//     const data = e.target.files[0];
//     console.log(data);

//     const reader = new window.FileReader();

//     reader.readAsArrayBuffer(data);
//     reader.onloadend = () => {
//       setFile(e.target.files[0]);
//     };
//     setFileName(e.target.files[0].name);
//     e.preventDefault();
//   };
//   return (
//     <div className="top">
//       <form className="form" onSubmit={handleSubmit}>
//         <label htmlFor="file-upload" className="choose">
//           {/*turn around for avoding choose file */}
//           Choose Image
//         </label>
//         <input
//           disabled={!account} //disabling button when metamask account is not connected
//           type="file"
//           id="file-upload"
//           name="data"
//           onChange={retrieveFile}
//         />
//         <span className="textArea">Image: {fileName}</span>
//         {/* choose file */}
//         <button type="submit" disabled={!file} className="upload">
//           Upload file
//         </button>
//       </form>
//     </div>
//   );
// }

// export default FileUpload;
