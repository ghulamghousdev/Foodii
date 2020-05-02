import axios from 'axios';

async function get(query){
   const result = await axios.get(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
   console.log(result);
}
get();