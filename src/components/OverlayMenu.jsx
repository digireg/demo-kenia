import React from "react";
import {
  Overlay,
  Drawer,
  CloseButton,
  OverlayMenuToolsContainer,
  OverlayMenuHeader,
  OverlayMenuUtilsContainer,
  OverlayMenuSettingsContainer,
  OverlayMenuDashboardContainer,
} from "../style_components/OverlayMenuStyle";
import { NavButton } from "../style_components/Buttons"; // adjust if needed
import {
  FiX,
  FiMap,
  FiLayers,
  FiEye,
  FiFilter,
  FiLink2,
  FiPrinter,
  FiHelpCircle,
} from "react-icons/fi";
import { FaRuler } from "react-icons/fa";
import { MdLabel, MdLanguage } from "react-icons/md";
import { Logo } from "../style_components/Theme";

export default function OverlayMenu({
  isOpen,
  onClose,
  onOpenOverlay,
  activePanel,
  setActivePanel,
}) {
  const handleOpenPanel = (panelName) => {
    setActivePanel(activePanel === panelName ? null : panelName);
    onClose();
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <Drawer $isOpen={isOpen}>
        <OverlayMenuHeader>
          <Logo />
          <CloseButton onClick={onClose} aria-label="Close menu">
            <FiX />
          </CloseButton>
        </OverlayMenuHeader>
        <OverlayMenuToolsContainer>
          <NavButton
            icon={<FiMap />}
            onClick={() => handleOpenPanel("achtergrond")}
          >
            Background layers
          </NavButton>

          <NavButton
            icon={<FiLayers />}
            onClick={() => handleOpenPanel("lagen")}
          >
            Data layers
          </NavButton>

          <NavButton
            icon={<FiEye />}
            onClick={() => handleOpenPanel("transparantie")}
          >
            Layer Opacity
          </NavButton>

          <NavButton
            icon={<FaRuler />}
            onClick={() => handleOpenPanel("metingen")}
          >
            Measuring tools
          </NavButton>

          <NavButton
            icon={<FiFilter />}
            onClick={() => handleOpenPanel("filter")}
          >
            Filters
          </NavButton>

          <NavButton
            icon={<MdLabel />}
            onClick={() => handleOpenPanel("labels")}
          >
            Label settings
          </NavButton>
        </OverlayMenuToolsContainer>
        <OverlayMenuUtilsContainer>
          <NavButton icon={<FiLink2 />}>Share</NavButton>
          <NavButton icon={<FiPrinter />}>Print settings</NavButton>
        </OverlayMenuUtilsContainer>
        <OverlayMenuSettingsContainer>
          <NavButton icon={<FiHelpCircle />}>Manuals</NavButton>
          <NavButton icon={<MdLanguage />}>Language</NavButton>
        </OverlayMenuSettingsContainer>
        <OverlayMenuDashboardContainer></OverlayMenuDashboardContainer>
      </Drawer>
    </>
  );
}
