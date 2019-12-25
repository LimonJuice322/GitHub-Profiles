function userInfo() {
  // Get username from form
  let username = document.querySelector('input').value;
  if (!username) {
    alert('Enter username');
  } else {
      // Check current information on page to avoid re-request
      if (document.querySelector('.login').textContent == username) {
        document.querySelector('input').value = '';
      }
      else {
        // Request
        document.querySelector('input').value = '';
        // Make the requests and render
        fetch(`https://api.github.com/users/${username}`)
          .then(response => response.json())
          .then(response => renderUser(response))
          .catch(err => console.log(err));
        fetch(`https://api.github.com/users/${username}/repos`)
          .then(response => response.json())
          .then(response => topRepos(response))
          .then(repos => renderRepos(repos))
          .catch(err => console.log(err));
      }
    }
}

function renderUser(user) {
  console.log(user);
  document.querySelector('.avatar').src = user.avatar_url;
  document.querySelector('.login').textContent = user.login;
  document.querySelector('.username').textContent = user.name;
  document.querySelector('.repos').textContent = user.public_repos + ' repos';
  document.querySelector('.followers').textContent = user.followers + ' followers';
  document.querySelector('.user-info').hidden = false;
}


function renderRepos(repos) {
  // Check current top repos to rewrite them
  if (document.querySelector('li') != null) {
    document.querySelectorAll('li').forEach( (li) => li.remove() );
  }
  repos.forEach( function(rep) {
  document.querySelector('ul').insertAdjacentHTML('beforeend', `
        <li>
          <span class="rep-name">${rep.name}</span>
          <span class="stars-forks"><img src="img/star.png">Stars</span><span class="count">${rep.stargazers_count}</span>
          <span class="stars-forks"><img src="img/fork.png">Forks</span><span class="count">${rep.forks}</span>
          <span class="rep-desc">${rep.description}</span>
        </li>`)
      })
}

// This function allows to get top 4 repos
function topRepos(repos) {
  // Turn the object into the array
  let arr_repos = Array.prototype.slice.call(repos, 0);
  // Sort arrays by stars and get top 4 repos
  return arr_repos.sort( (a, b) => b.stargazers_count - a.stargazers_count).slice(0, 4);
}

// Bind the handler to the form
document.querySelector('form').addEventListener('submit', userInfo);
