import React, { useState } from 'react';
import SideBarMenu from './SideBarMenu';
import OverlayMenu from './OverlayMenu';

export default function MenuContainer({ activePanel, setActivePanel }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <>
      <SideBarMenu onOpenOverlay={() => setIsOverlayOpen(true)} activePanel={activePanel} setActivePanel={setActivePanel}/>
      <OverlayMenu isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} activePanel={activePanel} setActivePanel={setActivePanel}/>
    </>
  );
}