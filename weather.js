const form  = document.querySelector(".top-banner form");
const input = document.querySelector("input");
const msg = document.querySelector("span.msg");
const cityList = document.querySelector(".cities");
const trButton = document.querySelector(".trButton");
const engButton = document.querySelector(".engButton");
const germanyButton = document.querySelector(".germanyButton");




localStorage.setItem("apiKey", EncryptStringAES("c2ece7f743b61976d674a5c43390eb67"));

// form bize enter ile click eventini tetikletir ve form reset kullanabildiğimiz için avantajla sağlar
form.addEventListener("submit", (event)=>{
    //formdaki submit işleminden sonra sayfa yenilemesini kendi irademizle prevent ettik
    event.preventDefault();
    getWeatherDataFromApi();
});

let lang = "tr";
trButton.addEventListener("click", ()=>{
    lang = "tr";
});
engButton.addEventListener("click", ()=>{
    lang = "en";
});
germanyButton.addEventListener("click", ()=>{
    lang = "de";
});





const getWeatherDataFromApi = async () =>{
    let apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
    let inputVal = input.value;
    let units = "metric";    
    let url =`https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=${units}&lang=${lang}`;

    try {
        const response = await axios(url);
        const{main,name,sys,weather}=response.data;
        //iconu img olarak alabilmek için tekrardan open weather apı den 
        const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

        let cityCardList = cityList.querySelectorAll(".city");
        let cityCardListArray = Array.from(cityCardList);

        if(cityCardListArray.length > 0 ){
            const filteredArray = cityCardListArray.filter(card => card.querySelector(".city-name span").innerText==name);
            if(filteredArray.length > 0){
                msg.innerText = `You already know the weather for ${name}`
                setTimeout(() => {
                    msg.innerText = "";
                }, 5000);
                form.reset();
                input.focus();
                return;
            }
        }



        let createdCityCardLi = document.createElement("li");//elementi oluştur
        createdCityCardLi.classList.add("city");//class ını ver
        //innerHtml ini oluştur
        createdCityCardLi.innerHTML = `
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
        </figure>`;
        cityList.prepend(createdCityCardLi);
        form.reset();
        form.focus();
        
        
    } catch (error) {
        msg.innerText = error;
        setTimeout(() => {
            msg.innerText = "";
        }, 5000);
        
    }

}