import React, { useState } from 'react';

export interface MenuItem {
    name: string;
    items: JSX.Element[];
    action: (event: React.MouseEvent<HTMLInputElement>) => void;
}

interface ComponentToggleBarProps {
    menuItems: MenuItem[];
    activeMenu: number | null;
    toggleMenu: (index: number) => void;
}

export const ComponentToggleBar: React.FC<ComponentToggleBarProps> = ({ menuItems, activeMenu, toggleMenu }) => {
    return (
        <div className="component-toggle-bar">
            {menuItems.map((menuItem, index) => (
                <div key={index} className="menu-item" onClick={() => toggleMenu(index)}>
                    {menuItem.name}
                    {activeMenu === index && (
                        <div className="menu-dropdown">
                            {menuItem.items.map((item, itemIndex) => (
                                <div key={itemIndex} onClick={menuItem.action}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};