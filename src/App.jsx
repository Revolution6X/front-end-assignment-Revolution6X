import { useState } from 'react'
import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [subreddit, setSubreddit] = useState("all");
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [yourFavorites, setYourFavorites] = useState([]);


  //Note: for fetching data https://dev.to/antdp425/react-fetch-data-from-api-with-useeffect-27le
  useEffect(()=>{
    if (subreddit == false) return;
    const searchData = async ()=>{
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`);
      const returnData = await response.json();
      setPosts(returnData.data.children.map((post)=>({
        id: post.data.id,
        title: post.data.title,
        score: post.data.score,
        url: `https://www.reddit.com${post.data.permalink}`,
      })));
    };

    searchData();
  }, [subreddit]);
  
  // Note: sessionStorage https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
  const favoritePost = (post)=>{
    if (yourFavorites.some((favorite) => favorite.id === post.id)) {
      return;
    }
    const anotherFavorite = [...yourFavorites, post];
    setYourFavorites(anotherFavorite);
    sessionStorage.setItem(post.id, JSON.stringify(anotherFavorite));
    console.log("Updated favorites:", anotherFavorite);
  };

  const removeFavorite = (post)=>{
    sessionStorage.removeItem(post.id);
    const newFavorites = yourFavorites.filter((favorite) => favorite.id != post.id);
    setYourFavorites(newFavorites);
    console.log("Updated favorites:", newFavorites);
  };

  //Note: table generator for lists and keys https://legacy.reactjs.org/docs/lists-and-keys.html
  return (
    <>
      <h1 style={{color:"LightBlue"}}>Favorite Reddit Posts</h1>
      <div>
        <label>
          Enter subreddit: &nbsp;&nbsp;
        </label>
        <input value={search} onChange={(e)=>setSearch(e.target.value)}></input>
        <button onClick={()=>setSubreddit(search)}>Search</button>
      </div>
      <h2 style={{color:"DodgerBlue"}}>r/{subreddit}</h2>
      
      <table style={{backgroundColor:'#3b3b3b'}}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Post Title</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index)=>(
            <tr key={post.id}>
              <td>{index + 1}</td>
              <td>
                <a href={post.url}>
                  {post.title}
                </a>
              </td>
              <td>{post.score}</td>
              <td>
                <button onClick={()=>favoritePost(post)}>Favorite</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/> <br/>

      <h2 style={{color:"LightGreen"}}>Your Favorite Posts</h2>
      <table style={{backgroundColor:'#3b3b3b'}}>
        <thead>
          <tr>
            <th>Number</th>
            <th>Post Title</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {yourFavorites.map((post, index)=>(
            <tr key={post.id}>
              <td>{index + 1}</td>
              <td>
                <a href={post.url}>
                  {post.title}
                </a>
              </td>
              <td>{post.score}</td>
              <td>
              <button onClick={()=>removeFavorite(post)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App
