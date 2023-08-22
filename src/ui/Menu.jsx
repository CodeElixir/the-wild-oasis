import { createContext, forwardRef, useContext, useRef } from "react";
import { Menu as HeadlessUIMenu, Transition } from "@headlessui/react";
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";

const MenuContext = createContext();

const Menu = forwardRef(function Menu(
  { children, className = "", ...rest },
  _ref,
) {
  const arrowRef = useRef(null);

  const {
    refs: { setReference, setFloating },
    floatingStyles,
  } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  return (
    <MenuContext.Provider
      value={{ setReference, setFloating, arrowRef, floatingStyles }}
    >
      <HeadlessUIMenu
        as="div"
        className={`inline-block text-left ${className}`}
        ref={_ref}
        {...rest}
      >
        {children}
      </HeadlessUIMenu>
    </MenuContext.Provider>
  );
});

const MenuButton = forwardRef(function MenuButton(
  { children, className = "", ...rest },
  _ref,
) {
  const { setReference } = useContext(MenuContext);

  return (
    <div>
      <HeadlessUIMenu.Button
        className={`inline-flex w-full justify-center ${className}`}
        ref={(node) => {
          setReference(node);
          if (_ref) {
            _ref.current = node;
          }
        }}
        {...rest}
      >
        {children}
      </HeadlessUIMenu.Button>
    </div>
  );
});

const MenuItems = forwardRef(function MenuItems(
  {
    children,
    className = "",
    transitionStyles = {
      enter: "transition ease-out duration-200",
      enterFrom: "opacity-0 translate-y-1",
      enterTo: "opacity-100 translate-y-0",
      leave: "transition ease-in duration-150",
      leaveFrom: "opacity-100 translate-y-0",
      leaveTo: "opacity-0 translate-y-1",
    },
    arrowStyles = "",
    ...rest
  },
  _ref,
) {
  const { setFloating, floatingStyles, arrowRef } = useContext(MenuContext);

  return (
    <Transition className="absolute" {...transitionStyles}>
      <div
        ref={arrowRef}
        className={`absolute z-10 h-2 w-2 rotate-45 bg-white shadow-lg focus:outline-none ${arrowStyles}`}
      />
      <HeadlessUIMenu.Items
        className={`z-10 flex w-screen max-w-min`}
        ref={(node) => {
          setFloating(node);
          if (_ref) {
            _ref.current = node;
          }
        }}
        style={floatingStyles}
        {...rest}
      >
        <div
          className={`flex-shrink rounded-xl bg-white shadow-lg focus:outline-none ${className}`}
        >
          {children}
        </div>
      </HeadlessUIMenu.Items>
    </Transition>
  );
});

Menu.Button = MenuButton;
Menu.Items = MenuItems;
Menu.Item = HeadlessUIMenu.Item;

export default Menu;
