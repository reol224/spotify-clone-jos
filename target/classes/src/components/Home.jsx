import React from "react";

const Home = () => {
    async function fetchData() {
        const res = await fetch("/api/users/me");

        res.json().then(res => {return "www"}).catch(error => console.log(error));
    }
  return (
    <div>

        This is the home component.
    </div>
  );
};
export default Home;
