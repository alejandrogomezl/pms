import React from 'react';

function User({ name, age }) {
  return (
    <div>
      <h2>User Component</h2>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
}

export default User;
