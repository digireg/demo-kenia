Structure:

src/
 ├─ config/
 │   ├─ backgroundLayersConfig.js
 │   └─ datasetconfig.js
 ├─ hooks/
 │   ├─ useOLMap.js
 │   ├─ useMapLayers.js
 │   ├─ useMeasurement.js
 │   └─ useFeatureInfo.js
 ├─ utils/
 │   └─ layerFactory.js
 ├─ components/
 │   ├─ AchtergrondLaagContainer.jsx
 │   ├─ DataLaagSelectContainer.jsx
 │   ├─ DataLabelContainer.jsx
 │   ├─ DataLayerCreate.jsx
 │   ├─ flattenDataLayers.jsx
 │   ├─ LaagData.jsx
 │   ├─ Legend.jsx
 │   ├─ Map.jsx
 │   ├─ MeasurementContainer.jsx
 │   ├─ MeasurementTools.jsx
 │   ├─ MenuContainer.jsx
 │   ├─ OverlayMenu.jsx
 │   ├─ Searchbar.jsx
 │   ├─ SideBarMenu.jsx
 │   ├─ TransparantieLaagContainer.jsx
 │   └─ ZoomControl.jsx
 ├─ style_components/
 │   ├─ Accordion.jsx
 │   ├─ AchtergrondLaagContainerStyle.jsx
 │   ├─ Buttons.jsx
 │   ├─ DataLaagSelectContainerStyle.jsx
 │   ├─ DataLabelContainerStyle.jsx
 │   ├─ FormStyles.jsx
 │   ├─ GlobalStyle.jsx
 │   ├─ LaagDataStyle.jsx
 │   ├─ Layout.jsx
 │   ├─ LegendStyle.jsx
 │   ├─ MapStyle.jsx
 │   ├─ MeasurementContainerStyle.jsx
 │   ├─ OverlayMenuStyle.jsx
 │   ├─ SearchStyle.jsx
 │   ├─ SidebarMenuStyle.jsx
 │   ├─ Slider.jsx
 │   ├─ Theme.jsx
 │   ├─ TransparantieLaagContainerStyle.jsx
 │   └─ ZoomControlStyle.jsx
 └─ App.jsx








 To-do in the future:

 OLMap Click & Measurement Issue (for later revisit)

Problem:

Click handler for querying WMS features (singleclick) doesn’t reactivate after turning off the measurement tool (isMeasureActive).
Previous attempts to guard the click handler with if (isMeasureActive || !isQueryActive) return; blocked clicks permanently after using the measurement tool.
useEffect logic for setting isQueryActive based on active layers and isMeasureActive didn’t fully restore query mode reliably.

Current Workaround:

Reverted to old version where the click handler always listens and respects active layers, without trying to auto-toggle isQueryActive.
Legend updates for active layers still work.

Potential Fix Ideas (future):
Ensure isQueryActive is recalculated immediately after measurement tool is deactivated.
Consider separating “click listening” from isQueryActive state — the handler could always run but ignore clicks only if isMeasureActive, not based on query state.
Use a useEffect or callback to reactivate query mode whenever measurement mode switches off, without overwriting other state updates.