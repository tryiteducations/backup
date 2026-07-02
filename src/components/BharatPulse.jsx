import { useState } from 'react';

const BharatPulse = () => {
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    images: [],
    cityName: '',
    mentorName: '',
    institutionName: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [entries, setEntries] = useState([]);
  const [showPastEntries, setShowPastEntries] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 7) {
      alert('Maximum 7 images allowed');
      return;
    }
    setCurrentEntry(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = () => {
    const newEntry = { ...currentEntry, date: new Date().toISOString().split('T')[0] };
    setEntries(prev => [newEntry, ...prev]);
    setCurrentEntry({
      title: '',
      content: '',
      images: [],
      cityName: '',
      mentorName: '',
      institutionName: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="bharat-pulse">
      <h2>Bharat Pulse</h2>

      <div className="create-entry">
        <h3>Create New Entry</h3>
        <input
          type="text"
          name="title"
          value={currentEntry.title}
          onChange={handleInputChange}
          placeholder="Title"
        />
        <textarea
          name="content"
          value={currentEntry.content}
          onChange={handleInputChange}
          placeholder="Content"
        />
        <input
          type="file"
          accept=".jpg,.png,.gif"
          multiple
          onChange={handleImageUpload}
          placeholder="Upload Images"
        />
        <input
          type="text"
          name="cityName"
          value={currentEntry.cityName}
          onChange={handleInputChange}
          placeholder="City Name"
        />
        <input
          type="text"
          name="mentorName"
          value={currentEntry.mentorName}
          onChange={handleInputChange}
          placeholder="Mentor Name"
        />
        <input
          type="text"
          name="institutionName"
          value={currentEntry.institutionName}
          onChange={handleInputChange}
          placeholder="Institution Name"
        />
        <button onClick={handleSubmit}>Post Entry</button>
      </div>

      <div className="view-entries">
        <button onClick={() => setShowPastEntries(!showPastEntries)}>
          {showPastEntries ? 'Hide Past Entries' : 'Show Past Entries'}
        </button>
        {showPastEntries && (
          <div className="past-entries">
            {entries.map((entry, idx) => (
              <div key={idx} className="entry-card">
                <h4>{entry.title}</h4>
                <p>City: {entry.cityName}</p>
                <p>Mentor: {entry.mentorName}</p>
                <p>Institution: {entry.institutionName}</p>
                <p>Date: {entry.date}</p>
                <p>{entry.content}</p>
                <div className="entry-images">
                  {entry.images.map((img, i) => (
                    <img key={i} src={URL.createObjectURL(img)} alt={`Image ${i}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BharatPulse;