const ParentMatch = document.querySelector(".all-matches");
const matches = ParentMatch.children;
const addNewMatch = document.querySelector(".add_match button");
const resetBtn = document.querySelector(".lws-reset");

const initialState = [
  {
    id: 0,
    value: 0,
  },
];

const scoreReducer = (state = initialState, action) => {
  if (action.type === "increment") {
    return state.map((item) => {
      console.log(item.value, action.payload.value);
      if (item.id == action.payload.id) {
        return {
          ...item,
          value: parseInt(item.value) + parseInt(action.payload.value),
        };
      }
      return item;
    });
  } else if (action.type === "decrement") {
    return state.map((item) => {
      if (item.id == action.payload.id) {
        let StateValue = parseInt(item.value);
        let actionValue = parseInt(action.payload.value);
        if (StateValue - actionValue >= 0) {
          return {
            ...item,
            value: StateValue - actionValue,
          };
        } else if (StateValue - actionValue < 0) {
          return {
            ...item,
            value: 0,
          };
        }
      }
      return item;
    });
  } else if (action.type === "addMatch") {
    return [
      ...state,
      {
        id: state.length,
        value: 0,
      },
    ];
  } else if (action.type === "resetAll") {
    const all = [...state];
    for (let i = 0; i < all.length; i++) {
      const element = all[i];
      element.value = 0;
    }
    return all;
  }
  return state;
};

const store = Redux.createStore(scoreReducer);

const render = () => {
  const state = store.getState();
  for (const item of state) {
    if (document.getElementById(`${item.id}`)) {
      document.getElementById(`${item.id}`).innerText = parseInt(item.value);
    }
  }
};

render();
store.subscribe(render);
// ------------------  DOM Part------------------

const match = (matches) => {
  for (let i = 0; i < matches.length; i++) {
    const element = matches[i];
    let matchNumber = element.querySelector("h3");
    matchNumber.innerText = `Match ${i + 1}`;
    // increment items
    const incrementForm = element.querySelector(".incrementForm");
    incrementForm.setAttribute("id", `increment${i}`);
    // decrement items
    const decrementForm = element.querySelector(".decrementForm");
    decrementForm.setAttribute("id", `decrement${i}`);
    // total item
    const total = element.querySelector("h2");
    total.setAttribute("id", `${i}`);
  }
};

const fieldControl = () => {
  const ParentMatch = document.querySelector(".all-matches");
  ParentMatch.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    const id = form.id.slice(9);
    const type = form.id.slice(0, 9);
    const input = form.querySelector('input[type="number"]');
    const value = input.value;
    store.dispatch({
      type: type,
      payload: {
        id: id,
        value: parseInt(value),
      },
    });
    input.value = "";
  });
};

match(matches);
fieldControl();

addNewMatch.addEventListener("click", () => {
  const newMatch = document.createElement("div");
  newMatch.setAttribute("class", "match");
  newMatch.innerHTML = `
    <div class="wrapper">
      <button class="lws-delete">
        <img src="./image/delete.svg" alt="" />
      </button>
      <h3 class="lws-matchName"></h3>
    </div>
    <div class="inc-dec">
      <form class="incrementForm">
        <h4>Increment</h4>
        <input type="number" name="increment" class="lws-increment" />
      </form>
      <form class="decrementForm">
        <h4>Decrement</h4>
        <input type="number" name="decrement" class="lws-decrement" />
      </form>
    </div>
    <div class="numbers">
      <h2 class="lws-singleResult">0</h2>
    </div>
  `;
  ParentMatch.appendChild(newMatch);
  store.dispatch({
    type: "addMatch",
  });
  match(matches);
});

//function of reset all matches score
resetBtn.addEventListener("click", () => {
  store.dispatch({
    type: "resetAll",
  });
});
