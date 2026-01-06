let filtercontainer =  document.querySelector(".filters")
let input = document.querySelector("#imageInput")
let canvas = document.querySelector("#image-canvas")
let ctx = canvas.getContext("2d")
let placeholder = document.querySelector(".placeholder")
const resetBtn = document.querySelector("#reset")
const download = document.querySelector("#download")
let presetContainer = document.querySelector(".presets")
let Filters = {
    brightness: {
        value :100,
        min:0,
        max:200,
        unit:'%'
    },
    contrast: {
        value :100,
        min:0,
        max:200,
        unit:'%'
    },
    saturate: {
        value :100,
        min:0,
        max:200,
        unit:'%'
    },
    grayscale: {
        value :0,
        min:0,
        max:100,
        unit:'%'
    },
    sepia: {
        value :0,
        min:0,
        max:100,
        unit:'%'
    },
    invert: {
        value :0,
        min:0,
        max:100,
        unit:'%'
    },
    hueRotate: {
        value :0,
        min:0,
        max:360,
        unit:'deg'
    },
    blur: {
        value :0,
        min:0,
        max:10,
        unit:'px'
    },
    opacity:{
        value :100,
        min:0,
        max:100,
        unit:'%'
    },
};
let presets = {
    oldSchool: {
  brightness: 90,
  contrast: 120,
  saturate: 80,
  grayscale: 10,
  sepia: 40,
  invert: 0,
  hueRotate: 5,
  blur: 0,
  opacity: 100
},
vintage: {
  brightness: 95,
  contrast: 110,
  saturate: 70,
  grayscale: 20,
  sepia: 60,
  invert: 0,
  hueRotate: 10,
  blur: 0.5,
  opacity: 100
},
drama: {
  brightness: 105,
  contrast: 150,
  saturate: 130,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  hueRotate: 0,
  blur: 0,
  opacity: 100
},
cinematic: {
  brightness: 95,
  contrast: 140,
  saturate: 120,
  grayscale: 0,
  sepia: 10,
  invert: 0,
  hueRotate: 350,
  blur: 0,
  opacity: 100
},
warm: {
  brightness: 105,
  contrast: 110,
  saturate: 130,
  grayscale: 0,
  sepia: 20,
  invert: 0,
  hueRotate: 15,
  blur: 0,
  opacity: 100
},
cold: {
  brightness: 100,
  contrast: 120,
  saturate: 90,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  hueRotate: 200,
  blur: 0,
  opacity: 100
},
blackWhite: {
  brightness: 100,
  contrast: 130,
  saturate: 0,
  grayscale: 100,
  sepia: 0,
  invert: 0,
  hueRotate: 0,
  blur: 0,
  opacity: 100
},
fade: {
  brightness: 110,
  contrast: 90,
  saturate: 85,
  grayscale: 5,
  sepia: 10,
  invert: 0,
  hueRotate: 0,
  blur: 0,
  opacity: 90
},
retro: {
  brightness: 100,
  contrast: 125,
  saturate: 110,
  grayscale: 10,
  sepia: 30,
  invert: 0,
  hueRotate: 30,
  blur: 0,
  opacity: 100
},
nior:{
    brightness: 90,
    contrast: 140,
    saturate: 0,
    grayscale: 100,
    sepia: 0,
    invert: 0,
    hueRotate: 0,
    blur: 0,
    opacity: 100

}
}
let file = null;
let image = null
if(localStorage.getItem("image")) {
    const img = new Image()
    img.src = localStorage.getItem("image")
    img.onload = function(){
        image = img
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(image,0,0)
        placeholder.style.display = "none"
        canvas.style.display = "block"
    }
}
function applyFilter(name,value,min,max,unit){
    let filters = document.createElement("div")
    filters.classList.add("filter")
    filters.innerHTML = `
                        <label for=${name}>${name}</label>
                        <input type="range" id="${name}" name="${name}" min="${min}" max="${max}" value="${value}">`
    filtercontainer.appendChild(filters)

    let filterInput = filters.querySelector("input")
    filterInput.addEventListener("input",(e)=>{
        Filters[name].value = e.target.value
        applyingFilter()
    })
    return filters
}

function createButton(name){
    const button = document.createElement("button")
    button.classList.add("presetBtn")
    button.innerText = name
    presetContainer.appendChild(button)
    button.addEventListener("click",()=>{
        const preset = presets[name]
        Object.keys(preset).forEach((filterName)=>{
            Filters[filterName].value = preset[filterName]
        })
        applyingFilter()
        filtercontainer.innerHTML = ""
        createFilters()
    })
}
Object.keys(presets).forEach((presetName)=>{
    createButton(presetName)
});



function createFilters(){
    Object.keys(Filters).forEach((filter)=>{
        let filterElement = applyFilter(filter,Filters[filter].value,Filters[filter].min,Filters[filter].max,Filters[filter].unit)
        return filterElement
})
}

// Call the function to create all filters
createFilters();

input.addEventListener("change",(e)=>{
     file = e.target.files[0]
    placeholder.style.display = "none"
        canvas.style.display = "block"
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = function(){
        image = img
        localStorage.setItem("image",img.src)
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(image,0,0)
    }
})

function applyingFilter(){
    if(!image) return;
    
    ctx.clearRect(0,0,canvas.width,canvas.height)
    
    // Dynamically build filter string
    const filterString = Object.keys(Filters).map(filterName => {
        const filter = Filters[filterName];
        const cssName = filterName === 'hueRotate' ? 'hue-rotate' : 
                       filterName;
        return `${cssName}(${filter.value}${filter.unit})`;
    }).join(' ');
    
    ctx.filter = filterString;
    ctx.drawImage(image,0,0);
}

resetBtn.addEventListener("click",()=>{
        Filters = {
    brightness: {
        value :100,
        min:0,
        max:200,
        unit:'%'
    },
    contrast: {
        value :100,
        min:0,
        max:200,
        unit:'%'
    },
    saturate: {
        value :100,
        min:0,
        max:200,
        unit:'%'
    },
    grayscale: {
        value :0,
        min:0,
        max:100,
        unit:'%'
    },
    sepia: {
        value :0,
        min:0,
        max:100,
        unit:'%'
    },
    invert: {
        value :0,
        min:0,
        max:100,
        unit:'%'
    },
    hueRotate: {
        value :0,
        min:0,
        max:360,
        unit:'deg'
    },
    blur: {
        value :0,
        min:0,
        max:10,
        unit:'px'
    },
    opacity:{
        value :100,
        min:0,
        max:100,
        unit:'%'
    },
}
    applyingFilter()
    filtercontainer.innerHTML = ""
    createFilters()

})
download.addEventListener("click",()=>{ 
    let link = document.createElement("a")
    link.download = "edited-image.png"
    link.href = canvas.toDataURL()
    link.click()
})