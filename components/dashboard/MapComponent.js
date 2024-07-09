import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faUser } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the FontAwesome CSS

const primaryColor = '#76b852';

const gardenerIcon = L.divIcon({
    html: <div style="color: green;"><i class="fa fa-leaf"></i></div>,
    className: 'custom-icon'
});

const userIcon = L.divIcon({
    html: <div style="color: blue;"><i class="fa fa-user"></i></div>,
    className: 'custom-icon'
});

const createCustomIcon = (size) => {
    return L.divIcon({
        html: `<div class="custom-icon" style="width: ${size}px; height: ${size}px; border: 3px solid ${primaryColor}; border-radius: 50%; transition: width 0.3s, height 0.3s;"></div>`,
        className: 'custom-icon',
        iconSize: [size, size], // size of the icon
        iconAnchor: [size / 2, size / 2], // point of the icon which will correspond to marker's location
    });
};

const MapComponent = ({ userLocations }) => {
    const ResizeMap = () => {
        const map = useMap();
        useEffect(() => {
            map.invalidateSize();
        }, [map]);
        return null;
    };

    return (
        <MapContainer center={[54.5, -3.0]} zoom={6} className="h-96 w-full rounded-lg shadow-md">
            <ResizeMap />
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

const MapComponentProduct = ({ productLocation }) => {
    const [zoomLevel, setZoomLevel] = useState(12);
    const [markerSize, setMarkerSize] = useState(100);

    const ResizeMap = () => {
        const map = useMap();
        useEffect(() => {
            map.invalidateSize();
            const handleZoom = () => {
                const newZoomLevel = map.getZoom();
                setZoomLevel(newZoomLevel);
                const newSize = 100 * Math.pow(1.5, newZoomLevel - 12); // Proportional size adjustment
                setMarkerSize(newSize);
            };

            map.on('zoomend', handleZoom);

            return () => {
                map.off('zoomend', handleZoom);
            };
        }, [map]);
        return null;
    };

    const customIcon = createCustomIcon(markerSize);

    return (
        <MapContainer
            center={[productLocation.lat, productLocation.lon]}
            zoom={zoomLevel} // Use the state for zoom level
            maxZoom={14} // Maximum zoom level
            className="h-96 w-full rounded-lg shadow-md"
        >
            <ResizeMap />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[productLocation.lat, productLocation.lon]} icon={customIcon} />
        </MapContainer>
    );
};

export { MapComponent, MapComponentProduct };
