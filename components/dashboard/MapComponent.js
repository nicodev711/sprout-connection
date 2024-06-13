'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faUser } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the FontAwesome CSS

const gardenerIcon = L.divIcon({
    html: `<div style="color: green;"><i class="fa fa-leaf"></i></div>`,
    className: 'custom-icon'
});

const userIcon = L.divIcon({
    html: `<div style="color: blue;"><i class="fa fa-user"></i></div>`,
    className: 'custom-icon'
});

const MapComponent = ({ userLocations }) => {
    return (
        <MapContainer center={[54.5, -3.0]} zoom={6} className="h-full w-full rounded-lg shadow-md">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {userLocations.map((user, index) => (
                <Marker
                    key={index}
                    position={[user.lat, user.lon]}
                    icon={user.isGardener ? gardenerIcon : userIcon}
                >
                    <Popup>
                        {user.isGardener ? 'Gardener' : 'User'}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default MapComponent;
