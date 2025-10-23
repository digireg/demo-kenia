// style_components/organisms/OverlayMenuOrganism.jsx
import React from "react";
import {
  Overlay,
  Drawer,
  CloseButton,
  OverlayMenuToolsSection,
  OverlayMenuHeader,
  OverlayMenuUtilsSection,
  OverlayMenuSettingsSection,
  OverlayMenuDashboardSection,
  Logo,
  NavButton,
} from "..";
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

const OverlayMenuOrganism = ({ isOpen, onClose, onOpenPanel, activePanel }) => {
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

        <OverlayMenuToolsSection>
          <NavButton
            icon={<FiMap />}
            onClick={() => onOpenPanel("achtergrond")}
          >
            Background layers
          </NavButton>

          <NavButton icon={<FiLayers />} onClick={() => onOpenPanel("lagen")}>
            Data layers
          </NavButton>

          <NavButton
            icon={<FiEye />}
            onClick={() => onOpenPanel("transparantie")}
          >
            Layer Opacity
          </NavButton>

          <NavButton icon={<FaRuler />} onClick={() => onOpenPanel("metingen")}>
            Measuring tools
          </NavButton>

          <NavButton icon={<FiFilter />} onClick={() => onOpenPanel("filter")}>
            Filters
          </NavButton>

          <NavButton icon={<MdLabel />} onClick={() => onOpenPanel("labels")}>
            Label settings
          </NavButton>
        </OverlayMenuToolsSection>

        <OverlayMenuUtilsSection>
          <NavButton icon={<FiLink2 />}>Share</NavButton>
          <NavButton icon={<FiPrinter />}>Print settings</NavButton>
        </OverlayMenuUtilsSection>

        <OverlayMenuSettingsSection>
          <NavButton icon={<FiHelpCircle />}>Manuals</NavButton>
          <NavButton icon={<MdLanguage />}>Language</NavButton>
        </OverlayMenuSettingsSection>

        <OverlayMenuDashboardSection />
      </Drawer>
    </>
  );
};

export default OverlayMenuOrganism;
