import { useState } from 'react';

const StudentDoubtSection = () => {
  const [uploads, setUploads] = useState({
    voiceNote: null,
    pdf: null,
    images: [],
    video: null
  });

  const handleUpload = (e) => {
    const newUploads = { ...uploads };
    const file = e.target.files[0];

    if (!file) return;

    switch (file.type) {
      case 'audio/mpeg':
      case 'audio/wave':
        newUploads.voiceNote = file;
        break;
      case 'application/pdf':
        newUploads.pdf = file;
        break;
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        newUploads.images = [...newUploads.images, file];
        break;
      case 'video/mp4':
      case 'video/quicktime':
        newUploads.video = file;
        break;
      default:
        alert('Unsupported file type');
        return;
    }

    setUploads(newUploads);
  };

  const handleSubmit = () => {
    console.log('Submitting uploads:', uploads);
  };

  return (
    <div className="doubt-section">
      <h2>Ask Doubts</h2>
      <div className="upload-section">
        <div className="upload-type">
          <label>Voice Note:</label>
          <input type="file" accept=".mp3,.wav" onChange={handleUpload} />
        </div>
        <div className="upload-type">
          <label>PDF:</label>
          <input type="file" accept=".pdf" onChange={handleUpload} />
        </div>
        <div className="upload-type">
          <label>Images:</label>
          <input type="file" accept=".jpg,.png,.gif" multiple onChange={handleUpload} />
        </div>
        <div className="upload-type">
          <label>Video:</label>
          <input type="file" accept=".mp4,.mov" onChange={handleUpload} />
        </div>
      </div>
      <button onClick={handleSubmit}>Submit Doubt</button>

      <div className="preview-section">
        {uploads.voiceNote && <p>Voice Note: {uploads.voiceNote.name}</p>}
        {uploads.pdf && <p>PDF: {uploads.pdf.name}</p>}
        {uploads.images.length > 0 && (
          <div>
            <p>Images:</p>
            <ul>
              {uploads.images.map((img, idx) => (
                <li key={idx}>{img.name}</li>
              ))}
            </ul>
          </div>
        )}
        {uploads.video && <p>Video: {uploads.video.name}</p>}
      </div>
    </div>
  );
};

export default StudentDoubtSection;