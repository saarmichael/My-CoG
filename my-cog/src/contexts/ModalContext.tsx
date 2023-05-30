import { ReactNode, createContext, useState } from "react";

export interface IModalContext {
    open: boolean;
    setOpen: (open: boolean) => void;
}

interface IModalProviderProps {
    children?: ReactNode;
}

export const ModalContext = createContext<IModalContext | null>(null);

export const ModalProvider: React.FC<IModalProviderProps> = ({ children }) => {
    const [open, setOpen] = useState(false); 
    return (
        <ModalContext.Provider value={{
            open, setOpen
        }}>
            {children}
        </ModalContext.Provider>
    );

};