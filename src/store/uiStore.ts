import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isNavbarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleNavbar: () => void;
  setNavbarOpen: (isOpen: boolean) => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isNavbarOpen: false,
  toggleSidebar: () => set((state) => ({ 
    isSidebarOpen: !state.isSidebarOpen, 
    isNavbarOpen: false 
  })),
  setSidebarOpen: (isOpen) => set((state) => ({ 
    isSidebarOpen: isOpen, 
    isNavbarOpen: isOpen ? false : state.isNavbarOpen 
  })),
  toggleNavbar: () => set((state) => ({ 
    isNavbarOpen: !state.isNavbarOpen, 
    isSidebarOpen: false 
  })),
  setNavbarOpen: (isOpen) => set((state) => ({ 
    isNavbarOpen: isOpen, 
    isSidebarOpen: isOpen ? false : state.isSidebarOpen 
  })),
  closeAll: () => set({ isSidebarOpen: false, isNavbarOpen: false }),
}));
