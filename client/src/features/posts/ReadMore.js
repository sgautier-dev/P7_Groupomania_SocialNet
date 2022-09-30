import React, { useState } from 'react';

const ReadMore = ({text}) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {setIsReadMore(!isReadMore)};

  return (
    <p className='excerpt'>
      {isReadMore ? text.slice(0, 200): text }
      {text.length > 200 &&
        <span className='post__readmore' onClick={toggleReadMore}>
          {isReadMore ? ' ... Afficher la suite' : '^Afficher moins'}
        </span>
      }
    </p>
  )
};

export default ReadMore;