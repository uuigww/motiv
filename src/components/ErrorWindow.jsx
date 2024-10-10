import React, { useState } from 'react';
import './ErrorWindow.css'; // Для стилей окна

const ErrorWindow = ({ message }) => {
    const [isOpen, setIsOpen] = useState(true); // Управление видимостью окна

    // Функция для закрытия окна
    const closeWindow = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null; // Если окно закрыто, не рендерим ничего

    return (
        <div className="error-overlay">
            <div className="error-window">
                <p>{message}</p>
                <button className="close-button" onClick={closeWindow}>
                    ✕
                </button>
            </div>
        </div>
    );
};

export default ErrorWindow;
