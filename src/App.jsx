import React, { useState, useEffect } from 'react';
import './App.css';

const floorplan = process.env.PUBLIC_URL + "/assets/floorplan.png";

function RadialMenu({ position, data, onClose }) {
  const statusColors = data.status;
  return (
    <div className="radial-menu" style={{ top: position.y, left: position.x }}>
      <div className="quadrant top" style={{ borderTopColor: statusColors.spec }}>
        <a href={'/assets/' + data.spec} target="_blank" rel="noopener noreferrer">Spec</a>
      </div>
      <div className="quadrant right" style={{ borderRightColor: statusColors.submittal }}>
        <a href={'/assets/' + data.submittal} target="_blank" rel="noopener noreferrer">Submittal</a>
      </div>
      <div className="quadrant bottom" style={{ borderBottomColor: statusColors.bim }}>
        <a href={'/assets/' + (data.bim || '')} target="_blank" rel="noopener noreferrer">BIM</a>
      </div>
      <div className="quadrant left" style={{ borderLeftColor: statusColors.rfi }}>
        <a href={'/assets/' + data.rfi} target="_blank" rel="noopener noreferrer">RFI</a>
      </div>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
}

function App() {
  const [doorData, setDoorData] = useState({});
  const [activeDoor, setActiveDoor] = useState(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/assets/door_data.json")
      .then(res => res.json())
      .then(setDoorData);
  }, []);

  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    for (const [id, data] of Object.entries(doorData)) {
      const dx = clickX - data.coords.x;
      const dy = clickY - data.coords.y;
      if (Math.sqrt(dx * dx + dy * dy) < 20) {
        setActiveDoor({ id, data, coords: { x: clickX, y: clickY } });
        return;
      }
    }
    setActiveDoor(null);
  };

  return (
    <div className="App">
      <div className="floorplan-container" onClick={handleClick}>
        <img src={floorplan} alt="Floor Plan" className="floorplan-img" />
        {activeDoor && (
          <RadialMenu
            position={activeDoor.coords}
            data={activeDoor.data}
            onClose={() => setActiveDoor(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;