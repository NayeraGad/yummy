/* 
        Document Constants
 */
const searchAnchor = document.getElementById("search");
const categoriesAnchor = document.getElementById("categories");
const areaAnchor = document.getElementById("area");
const ingredientsAnchor = document.getElementById("ingredients");
const contactAnchor = document.getElementById("contact");
const searchInputs = document.querySelector(".searchInputs");
const data = document.querySelector(".data");

/* 
        Variables
 */
const navWidth = $(".inner").outerWidth(true);
const linkListWidth = $(".links").height();
let isOpen = false;

/* 
        Loading Screen
 */
$(function () {
  searchByName("").then(() => {
    $(".loading").fadeOut(500);
    $("body").css("overflow", "auto");
  });
});

/* 
        Side Navbar
*/
// Check whether navbar is open or closed
$(".toggle-nav").on("click", () => {
  isOpen = !isOpen;

  isOpen ? openNavbar() : closeNavbar();
});

function openNavbar() {
  $(".side-navbar").animate({ left: 0 }, 500);
  $(".toggle-nav").removeClass("fa-align-justify");
  $(".toggle-nav").addClass("fa-x");
  slideLinksUp();

  isOpen = true;
}

function closeNavbar() {
  $(".side-navbar").animate({ left: -navWidth }, 500);
  $(".toggle-nav").removeClass("fa-x");
  $(".toggle-nav").addClass("fa-align-justify");
  slideLinksDown();

  isOpen = false;
}

function slideLinksUp() {
  for (let i = 0; i < 5; i++) {
    $(".link")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
}

function slideLinksDown() {
  for (let i = 0; i < 5; i++) {
    $(".link").eq(i).animate(
      {
        top: linkListWidth,
      },
      500
    );
  }
}

closeNavbar();

/* 
        Search 
 */
searchAnchor.addEventListener("click", displayInputs);

// Display Inputs when Search Anchor is clicked
function displayInputs() {
  closeNavbar();
  searchInputs.innerHTML = `<div class="row py-4">
            <div class="col-md-6">
              <input
                onInput='searchByName(this.value)'
                type="text"
                placeholder="Search By Name"
                class="form-control bg-transparent text-white"
              />
            </div>

            <div class="col-md-6">
              <input
                onInput='searchByLetter(this.value)'
                type="text"
                placeholder="Search By First Letter"
                class="form-control bg-transparent text-white"
                maxlength="1"
              />
            </div>
          </div>`;
  data.innerHTML = ``;
}

// Search by Name
async function searchByName(name) {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    let data = await res.json();

    displayMeals(data.meals);
  } catch (error) {
    console.log(error);
  }
}

// Search by letter
async function searchByLetter(letter) {
  try {
    if (letter === "") {
      letter = "a";
    }

    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    let data = await res.json();
    displayMeals(data.meals);
  } catch (error) {
    console.log(error);
  }
}

/* 
        Display Categories
 */
categoriesAnchor.addEventListener("click", getCategories);

// Display Categories
async function getCategories() {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    let data = await res.json();

    displayCategories(data.categories);
  } catch (error) {
    console.log(error);
  }
}

function displayCategories(category) {
  $(".innerLoading").fadeIn(300, () => {
    $(".innerLoading").fadeOut(300);
  });
  closeNavbar();
  searchInputs.innerHTML = "";

  let cards = "";

  for (let i = 0; i < category.length; i++) {
    cards += `<div class="col-md-3">
              <div
                onclick="getCategoryMeals('${category[i].strCategory}')"
                class="mealCard position-relative rounded-2 overflow-hidden pointer"
              >
                <img
                  src="${category[i].strCategoryThumb}"
                  alt="${category[i].strCategory}"
                  class="w-100"
                />
                <div
                  class="card-layer position-absolute d-flex flex-column align-items-center p-2 text-black text-center"
                >
                  <h3>${category[i].strCategory}</h3>
                  <p>
                    ${category[i].strCategoryDescription
                      .split(" ")
                      .slice(0, 20)
                      .join(" ")}
                  </p>
                </div>
              </div>
            </div>`;
  }

  data.innerHTML = cards;
}

// Get Meals of the Selected Category
async function getCategoryMeals(id) {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${id}`
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    let data = await res.json();

    displayMeals(data.meals.slice(0, 20));
  } catch (error) {
    console.log(error);
  }
}

/* 
        Display Area
 */
areaAnchor.addEventListener("click", getArea);

// Display Areas
async function getArea() {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    let data = await res.json();

    displayAreas(data.meals);
  } catch (error) {
    console.log(error);
  }
}

function displayAreas(area) {
  $(".innerLoading").fadeIn(300, () => {
    $(".innerLoading").fadeOut(300);
  });
  closeNavbar();
  searchInputs.innerHTML = "";

  let cards = "";

  for (let i = 0; i < area.length; i++) {
    cards += `<div class="col-md-3">
              <div
                onclick="getAreaMeals('${area[i].strArea}')"
                class="pointer text-center"
              >
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${area[i].strArea}</h3>
              </div>
            </div>`;
  }

  data.innerHTML = cards;
}

// Get Meals of the Selected Area
async function getAreaMeals(id) {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${id}`
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    let data = await res.json();

    displayMeals(data.meals.slice(0, 20));
  } catch (error) {
    console.log(error);
  }
}

/* 
        Display Ingredients
 */
ingredientsAnchor.addEventListener("click", getIngredients);

// Display Ingredients
async function getIngredients() {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    let data = await res.json();

    displayIngredients(data.meals.slice(0, 20));
  } catch (error) {
    console.log(error);
  }
}

function displayIngredients(ingredient) {
  $(".innerLoading").fadeIn(300, () => {
    $(".innerLoading").fadeOut(300);
  });
  closeNavbar();
  searchInputs.innerHTML = "";

  let cards = "";

  for (let i = 0; i < ingredient.length; i++) {
    cards += `<div class="col-md-3">
              <div
                onclick="getIngredientMeals('${ingredient[i].strIngredient}')"
                class="pointer text-center"
              >
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredient[i].strIngredient}</h3>
                <p>${ingredient[i].strDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
              </div>
            </div>`;
  }

  data.innerHTML = cards;
}

// Get meals of the Selected Ingredient
async function getIngredientMeals(id) {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${id}`
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    let data = await res.json();

    displayMeals(data.meals.slice(0, 20));
  } catch (error) {
    console.log(error);
  }
}

/* 
        Display Meals
 */
function displayMeals(meals) {
  $(".innerLoading").fadeIn(300, () => {
    $(".innerLoading").fadeOut(300);
  });
  let cards = "";

  for (let i = 0; i < meals.length; i++) {
    cards += `<div class="col-md-4 col-lg-3">
                <div onclick="getMealDetails('${meals[i].idMeal}')" class="mealCard position-relative rounded-2 overflow-hidden pointer">
                    <img src="${meals[i].strMealThumb}" alt="${meals[i].strMeal}" class="w-100">
                    <div class="card-layer position-absolute d-flex align-items-center p-2 text-black">
                        <h3>${meals[i].strMeal}</h3>
                    </div>
                </div>
        </div>`;
  }

  data.innerHTML = cards;
}

/* 
      Display Single Meal Details
 */
async function getMealDetails(id) {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    let data = await res.json();

    displayMealDetails(data.meals);
  } catch (error) {
    console.log(error);
  }
}

function displayMealDetails(meal) {
  $(".innerLoading").fadeIn(300, () => {
    $(".innerLoading").fadeOut(300);
  });
  closeNavbar();

  searchInputs.innerHTML = "";

  let ingredients = ``;
  for (let i = 1; i <= 20; i++) {
    if (meal[0][`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[0][`strMeasure${i}`]
      } ${meal[0][`strIngredient${i}`]}</li>`;
    }
  }

  let tagsStr = "";
  if (meal[0].strTags) {
    let tags = meal[0].strTags.split(",");
    for (let i = 0; i < tags.length; i++) {
      tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
    }
  }

  data.innerHTML = `
  <div class="col-lg-4 ps-4">
    <img src="${meal[0].strMealThumb}" alt="${meal[0].strMeal}" class="w-100 rounded-3" />
    <h2 class="mt-2">${meal[0].strMeal}</h2>
  </div>

  <div class="col-lg-8 ps-4">
    <h3 class="h2">Instructions</h3>
    <p>${meal[0].strInstructions}</p>
    <h3><span class="fw-bolder">Area :</span> ${meal[0].strArea}</h3>
    <h3><span class="fw-bolder">Category :</span> ${meal[0].strCategory}</h3>

    <div class="recipesList">
      <h3>Recipes :</h3>
      <ul class="d-flex flex-wrap g-3 ps-0">
        ${ingredients}
      </ul>
    </div>

    <div class="tagsList">
      <h3>Tags :</h3>
      <ul class="d-flex flex-wrap g-3 ps-0">
        ${tagsStr}
      </ul>
    </div>

    <a href="${meal[0].strSource}" target="_blank" class="btn btn-success">Source</a>
    <a href="${meal[0].strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
  
  </div>
`;
}

/* 
        Contact Section
*/
contactAnchor.addEventListener("click", displayContactInputs);

// Display Form Inputs
function displayContactInputs() {
  closeNavbar();
  searchInputs.innerHTML = "";

  data.innerHTML = `<div
              class="contact d-flex justify-content-center align-items-center vh-100"
            >
              <div
                class="contact min-vh-100 d-flex justify-content-center align-items-center"
              >
                <div class="container w-75 text-center">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <input
                        id="name"
                        onInput="showAlert('name' , 'nameAlert')"
                        type="text"
                        class="contactInput form-control"
                        placeholder="Enter Your Name"
                      />
                      <div
                        id="nameAlert"
                        class="alert alert-danger w-100 mt-2 d-none"
                      >
                        Special characters and numbers not allowed
                      </div>
                    </div>

                    <div class="col-md-6">
                      <input
                        id="email"
                        onInput="showAlert('email' , 'emailAlert')"
                        type="email"
                        class="contactInput form-control"
                        placeholder="Enter Your Email"
                      />
                      <div
                        id="emailAlert"
                        class="alert alert-danger w-100 mt-2 d-none"
                      >
                        Email not valid *exemple@yyy.zzz
                      </div>
                    </div>

                    <div class="col-md-6">
                      <input
                        id="phone"
                        onInput="showAlert('phone' , 'phoneAlert')"
                        type="text"
                        class="contactInput form-control"
                        placeholder="Enter Your Phone"
                      />
                      <div
                        id="phoneAlert"
                        class="alert alert-danger w-100 mt-2 d-none"
                      >
                        Enter valid Phone Number
                      </div>
                    </div>

                    <div class="col-md-6">
                      <input
                        id="age"
                        onInput="showAlert('age' , 'ageAlert')"
                        type="number"
                        class="contactInput form-control"
                        placeholder="Enter Your Age"
                      />
                      <div
                        id="ageAlert"
                        class="alert alert-danger w-100 mt-2 d-none"
                      >
                        Enter valid age
                      </div>
                    </div>

                    <div class="col-md-6">
                      <input
                        id="password"
                        onInput="showAlert('password' , 'passwordAlert')"
                        type="password"
                        class="contactInput form-control"
                        placeholder="Enter Your Password"
                      />
                      <div
                        id="passwordAlert"
                        class="alert alert-danger w-100 mt-2 d-none"
                      >
                        Enter valid password *Minimum eight characters, at least
                        one letter and one number:*
                      </div>
                    </div>

                    <div class="col-md-6">
                      <input
                        id="repassword"
                        onInput="showAlert('repassword' , 'repasswordAlert')"
                        type="password"
                        class="contactInput form-control"
                        placeholder="Repassword"
                      />
                      <div
                        id="repasswordAlert"
                        class="alert alert-danger w-100 mt-2 d-none"
                      >
                        Enter valid repassword
                      </div>
                    </div>
                  </div>
                  <button
                    id="submitBtn"
                    disabled
                    class="btn btn-outline-danger mt-3 px-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>`;

  const submitBtn = document.getElementById("submitBtn");
  const inputs = Array.from(document.querySelectorAll(".contactInput"));

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", validateAllValues);
  }

  function validateAllValues() {
    // Check if All Inputs are Valid
    // Then Enable the Submit Btn
    let isAllValid = true;

    for (let i = 0; i < inputs.length; i++) {
      if (!validateValue(inputs[i].id, inputs[i].value)) {
        isAllValid = false;
        return;
      }
    }

    if (isAllValid) {
      submitBtn.removeAttribute("disabled");
    } else {
      submitBtn.setAttribute("disabled", "true");
    }
  }
}

function showAlert(inputId, inputValue) {
  const input = document.getElementById(inputId);
  const alert = document.getElementById(inputValue);
  const isValid = validateValue(inputId, input.value);

  // Show Alert if Input Value is not Valid
  if (!isValid) {
    alert.classList.replace("d-none", "d-block");
  } else {
    alert.classList.replace("d-block", "d-none");
  }
}

function validateValue(inputId, inputValue) {
  // Check Input Validation
  if (inputId === "name") {
    return /^[a-zA-Z ]+$/.test(inputValue);
  } else if (inputId === "email") {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      inputValue
    );
  } else if (inputId === "phone") {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
      inputValue
    );
  } else if (inputId === "age") {
    return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(inputValue);
  } else if (inputId === "password") {
    return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(inputValue);
  } else if (inputId === "repassword") {
    return inputValue === document.getElementById("password").value;
  } else {
    return false;
  }
}
