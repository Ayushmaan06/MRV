import { useEffect, useState } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const [shareAddress, setShareAddress] = useState('');
  const [accessList, setAccessList] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    const loadAccessList = async () => {
      if (contract) {
        try {
          const addressList = await contract.shareAccess();
          setAccessList(addressList);
        } catch (error) {
          console.error("Error loading access list:", error);
        }
      }
    };
    loadAccessList();
  }, [contract]);

  const handleShare = async (e) => {
    e.preventDefault();
    if (!shareAddress.trim()) return;
    
    setIsSharing(true);
    try {
      await contract.allow(shareAddress.trim());
      setShareSuccess(true);
      setShareAddress('');
      
      // Refresh access list
      const updatedAccessList = await contract.shareAccess();
      setAccessList(updatedAccessList);
      
      setTimeout(() => {
        setShareSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error sharing access:", error);
      alert("Failed to grant access. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleRevoke = async (address) => {
    try {
      await contract.disallow(address);
      
      // Refresh access list
      const updatedAccessList = await contract.shareAccess();
      setAccessList(updatedAccessList);
    } catch (error) {
      console.error("Error revoking access:", error);
      alert("Failed to revoke access. Please try again.");
    }
  };
  return (
    <div className="modal-overlay" onClick={() => setModalOpen(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">👥 Manage Access</h2>
          <button className="close-button" onClick={() => setModalOpen(false)}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Grant Access Section */}
          <div className="section">
            <h3 className="section-subtitle">Grant New Access</h3>
            <form onSubmit={handleShare} className="share-form">
              <input
                type="text"
                value={shareAddress}
                onChange={(e) => setShareAddress(e.target.value)}
                placeholder="Enter wallet address (0x...)"
                className="address-input"
                disabled={isSharing}
              />
              <button 
                type="submit" 
                className="share-button"
                disabled={isSharing || !shareAddress.trim()}
              >
                {isSharing ? (
                  <>
                    <span className="loading-spinner"></span>
                    Granting...
                  </>
                ) : (
                  '🔐 Grant Access'
                )}
              </button>
            </form>
            
            {shareSuccess && (
              <div className="success-message">
                ✅ Access granted successfully!
              </div>
            )}
          </div>

          {/* Current Access List */}
          <div className="section">
            <h3 className="section-subtitle">Current Access ({accessList.length})</h3>
            
            {accessList.length === 0 ? (
              <div className="empty-access">
                <p>No one has access to your images yet.</p>
              </div>
            ) : (
              <div className="access-list">
                {accessList.map((address, index) => (
                  <div key={index} className="access-item">
                    <div className="access-info">
                      <span className="access-address">
                        {address.substring(0, 6)}...{address.substring(38)}
                      </span>
                      <span className="access-badge">🔓 Can View</span>
                    </div>
                    <button 
                      className="revoke-button"
                      onClick={() => handleRevoke(address)}
                      title="Revoke access"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={() => setModalOpen(false)}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal;
