// import useButton
import { useButton } from "@react-aria/button";
import { useRef, useState } from "react";
import { FocusRing } from "@react-aria/focus";
// import motion and useAnimation
import { motion, useAnimation } from "framer-motion";

// I wanted to have a nice satisfying animation when the press event actually occurred, 
// just like it does throughout most of iOS, and especially the calculator app, where 
// it's not ambiguous at all whether you've tapped the button.

export default function CalculatorPage() {
  let [nums, setNums] = useState([]);

  function handleClick(num) {
    setNums([...nums, num]);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xs flex-col items-center justify-center p-6">
      <div className="ml-auto text-8xl font-extralight tabular-nums text-white">
        {nums.length ? nums.slice(-3).join("") : 0}
      </div>
      <div className="mt-9 flex flex-wrap justify-between gap-4">
        <Button onClick={() => handleClick(7)}>7</Button>
        <Button onClick={() => handleClick(8)}>8</Button>
        <Button onClick={() => handleClick(9)}>9</Button>
        <Button onClick={() => handleClick(4)}>4</Button>
        <Button onClick={() => handleClick(5)}>5</Button>
        <Button onClick={() => handleClick(6)}>6</Button>
        <Button onClick={() => handleClick(1)}>1</Button>
        <Button onClick={() => handleClick(2)}>2</Button>
        <Button onClick={() => handleClick(3)}>3</Button>
      </div>
    </div>
  );
}


// We want to improve the clicking / pressing here a bit. If users cancel a press, we want to give them visual 
// feedback.Both on mobile and desktop. Also if we select w keyboard we can press Space(which shows active class) or Enter, which doesn't. 
// Also, if Space is held it only triggers once, whereas Enter repeat clicks the button. Browsers don't all handle this consistently, 
// either.So we want ot normalize this.

// This is where we are going to bring in useButton from React Aria.
// There's also a usePress that has this but useButton is better since we're building a button.


function Button({ onClick, children }) {
  // give us a set of controls that we can pass in to animate
  let controls = useAnimation();
  let ref = useRef();
  // and now we can trigger animations on press!
  let { buttonProps } = useButton(
    // Works after animation but doesn't interrupt to do that we can use 
    // `controls.stop()` to stop any currently running animations:
    {
      onPressStart: () => {
        controls.stop();
        controls.set({ background: "#757376" });
      },
      //  bring back our drag- off behavior we can use`onPressEnd` and copy over the onPress animation:
      onPressEnd: () => {
        controls.start({
          background: "#353336",
          transition: { duration: 0.4 },
        });
      },
      // onPress - spacebar and numbers will be able to work on our calculator
      onPress: onClick,
    },
    ref
  );


  // Fortunately, React Aria has our back here with a component that's aware of the focus 
  // state it's called FocusRing. We just wrap our button in it and get some props: 
  // `focusRingClass` lets us apply classes when our button is focused via the keyboard.
  return (
    <FocusRing focusRingClass="ring ring-offset-2 ring-offset-black">
      <motion.button
        animate={controls}
        {...buttonProps}
        // Check on desktop, mouse is great. Keyboard, great. Now mobile. 
        // Bit of a flicker here. One last thing we need, this is actually coming 
        // from the webkit tap highlight color css property. Since we're implementing this 
        // all our own let's set this to transparent.
        style={{
          WebkitTapHighlightColor: "transparent",
        }}
        // for styling our ios buttons 
        // select-none class - if you long press the buttons, you won't abe able to select the text
        // touch-none class - be able to hold button without draging the screen
        className="h-20 w-20 touch-none select-none rounded-full bg-[#353336] text-[40px] text-white focus:outline-none"
      >
        {children}
      </motion.button>
    </FocusRing>
  );
}
