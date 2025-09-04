import styled from 'styled-components';

const StyledNavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /*width: max-content; /* or fit-content */
  /*height: max-content; /* or fit-content */
    width: 100%; /* or fit-content */
  height: 100%; /* or fit-content */
  ${'' /* padding: 8px 12px; */}
  border: none;
  border-radius: 5px;
  background-color: #fff;
  color: #000;
  font-size: 14px;
  cursor: pointer;
  gap:10px;
  padding:10px 5px;

  span{
  display: flex;
  width: max-content; /* or fit-content */
  height: max-content; /* or fit-content */
  }

  &.icon-right {
    flex-direction: row-reverse; /* put icon on the right */
  }

  &:hover {
    color: #ffffff;
    background-color:#aab9dc;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export function NavButton({
  icon,
  children,
  hideText = false,          // default: show text
  iconPosition = 'left',     // or 'right'
  ...props
}) {
  return (
    <StyledNavButton
      className={iconPosition === 'right' ? 'icon-right' : ''}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {!hideText && children}
    </StyledNavButton>
  );
}


const StyledMapButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content; /* or fit-content */
  height: max-content; /* or fit-content */
  ${'' /* padding: 8px 12px; */}
  border: none;
  border-radius: 6px;
  background-color: #fff;
  color: #000;
  font-size: 14px;
  cursor: pointer;
  gap:10px;
  padding:10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);


  span{
  display: flex;
  width: max-content; /* or fit-content */
  height: max-content; /* or fit-content */
  }

  &.icon-right {
    flex-direction: row-reverse; /* put icon on the right */
  }

  background-color: ${({ $active }) => ($active ? '#284F97' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#fff' : '#000')};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#284F97' : '#aab9dc')};
    color: #ffffff;
  }


  ${'' /* &:hover {
    background-color: ${({ $active }) => ($active ? '#284F97' : '#284F97')};
    border-color: #284F97;
    color: #ffffff;
    outline: none;
  }



  &:active{
    border-color: #284F97;
    color: #ffffff;
    outline: none;
  } */}

  svg {
    width: 20px;
    height: 20px;
  }
`;

export function MapButton({
  icon,
  children,
  hideText = false,          // default: show text
  iconPosition = 'left',     // or 'right'
  ...props
}) {
  return (
    <StyledMapButton
      className={iconPosition === 'right' ? 'icon-right' : ''}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {!hideText && children}
    </StyledMapButton>
  );
}