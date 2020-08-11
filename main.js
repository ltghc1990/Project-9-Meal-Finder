inputMeal = document.getElementById("searchMeal");
formParent = document.querySelector("form");

enterBtn = document.getElementById("enter");

mealUIParent = document.getElementById("mealUI");

enterBtn.addEventListener("click", preFetchData);

function preFetchData(e) {
  e.preventDefault();
  // clear dom if there are elements there
  clearDom();
  const searchValue = inputMeal.value;
  if (searchValue.trim() === "") {
    //  show error
  } else {
    fetchData(searchValue);
  }
}

// Fetch the data from the api and load it into Dpm
async function fetchData(search) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
  );
  const data = await res.json();

  // load meals into DOM
  data.meals.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.style.width = "18rem";

    div.innerHTML = ` 
    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title" data-mealID="${element.idMeal}">${element.strMeal}</h5>
      <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Instructions</a>
    </div>
   `;
    mealUIParent.classList.add("card", "card-body", "centered");
    mealUIParent.appendChild(div);
    inputMeal.value = "";
  });

  return data;
}

function clearDom() {
  mealUIParent.innerHTML = "";
}

mealUIParent.addEventListener("click", (e) => {
  e.preventDefault();
  // grab parent element and set the default modal
  document.getElementById("exampleModal").innerHTML = `
  <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel"></h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <img src="" class="card-img-top modal-img" id="image">
          <div class="modal-body">
            <ul class="list-group" id="ingredients"></ul>
            <br>
            <p id="instructions"><p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      `;
  // get id of meal then fetch by id
  if (e.target.tagName.toLowerCase() === "a") {
    const id = e.target.previousElementSibling.getAttribute("data-mealID");
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const meal = data.meals[0];
        console.log(meal);

        getIngredients(meal);

        document.getElementById(
          "exampleModalLabel"
        ).innerText = `${meal.strMeal}`;

        document.getElementById("image").src = `${meal.strMealThumb}`;

        document.getElementById(
          "instructions"
        ).innerText = `${meal.strInstructions}`;
      });
  }
});

// to combine the ingredients and measurements from the api
function getIngredients(meal) {
  for (let i = 1; i < 20; i++) {
    if (meal[`strIngredient${i}`] !== "") {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerText = meal[`strIngredient${i}`] + " - " + meal[`strMeasure${i}`];

      document.getElementById("ingredients").appendChild(li);
    }
  }
}
