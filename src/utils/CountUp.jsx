import React, { useState, useEffect } from 'react';

const CountUp = ({ finalValue, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    const updateCount = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // ⬅️ clamp 0..1

      const nextCount = Math.round(finalValue * progress);
      setCount(nextCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
    return () => setCount(finalValue);
  }, [finalValue, duration]);

  return Number((count ? parseFloat(count).toFixed(2) : 0)).toLocaleString("en-IN");
};

export default CountUp;
























// import React, { useState, useEffect } from 'react';

// const CountUp = ({ finalValue, duration = 1500 }) => {
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     const startTime = Date.now();
//     const updateCount = () => {
//       const elapsedTime = Date.now() - startTime;
//       const progress = elapsedTime / duration;
//       const nextCount = Math.round(finalValue * progress);
//       setCount(Math.min(nextCount, finalValue));
//       if (nextCount < finalValue) {
//         requestAnimationFrame(updateCount);
//       }
//     };
//     requestAnimationFrame(updateCount);
//     return () => setCount(finalValue);
//   }, [finalValue, duration]);

//   return Number((count ? parseFloat(count).toFixed(2) : 0)).toLocaleString("en-IN")

// }
// export default CountUp;



