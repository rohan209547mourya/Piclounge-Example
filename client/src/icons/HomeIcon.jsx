import * as React from 'react';

const HomeIcon = (props) => (
  <svg
    id="glyph"
    height={512}
    viewBox="0 0 64 64"
    width={512}
    xmlns="http://www.w3.org/2000/svg"
    // eslint-disable-next-line react/destructuring-assignment
    fill={props.fill || '#9E9898'}
    {...props}
  >
    <path d="m59 23.132v29.868a6.006 6.006 0 0 1 -6 6h-10a4 4 0 0 1 -4-4v-11a2 2 0 0 0 -2-2h-10a2 2 0 0 0 -2 2v11a4 4 0 0 1 -4 4h-10a6.006 6.006 0 0 1 -6-6v-29.868a4.019 4.019 0 0 1 1.942-3.432l23-13.8a4 4 0 0 1 4.117 0l23 13.8a4.019 4.019 0 0 1 1.941 3.432z" />
  </svg>
);
export default HomeIcon;
