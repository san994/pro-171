var userId = null;
AFRAME.registerComponent("marker-handler",{
    init:function(){
        this.el.addEventListener("markerFound",(e)=>{
            var markerId = this.el.id;
            var toys = this.getToys()
            var toy = toys.filter(toy=>{toy.id===markerId})[0]
            if(toy.is_out_of_stock===false){
               this.HandleMarkerFound(toy);
            }else{
                swal({
                    icon:"warning",
                    text:"sorry this toy is out of stock",
                    timer:2500,
                    buttons:false
                })
            }
        })
        this.el.addEventListener("markerLost",(e)=>{
            this.HandleMarkerLost();
        })
    },
    HandleMarkerFound:function(toy){
        var modelContainer = document.querySelector(`model-${toy.id}`)
        modelContainer.setAttribute("visible",true);

        var ingrediantsContainer=document.querySelector(`#main-plane-${toy.id}`);
        ingrediantsContainer.setAttribute("visible",true);
  
        var pricePlane = document.querySelector(`#price-plane-${toy.id}`);
        pricePlane.setAttribute("visible",true);
        
        var button = document.getElementById("button-div");
        button.style.display="flex"

        var ratingButton = documnet.getElementById("rating-button");
        var orderButton = documnet.getElementById("order-button");

        // Handling Click Events 
        ratingButton.addEventListener("click", function () { 
            swal({ icon: "warning", title: "Rate Dish", text: "Work In Progress" }); 
        }); 

        orderButton.addEventListener("click", () => { 
            if(userId===null){
                userId = this.askUserId()
            }
            else{
                var userNumber;
                userId<=9?userNumber=`U0${userId}`:userNumber=`U${userId}`;
                this.handleOrder(userNumber,toy);
            }
            
        });
    },
    HandleOrder:function(userNumber,toy){
      firebase
      .firestore()
      .collection("users")
      .doc(userNumber)
      .get()
      .then(doc=>{
        var details = doc.data();
        if(details["current_orders"][toy.id]){
            details["current_orders"][toy.id]["quantity"]+=1;

            var currentQuantity = details["current_orders"][toy.id]["quantity"];
            details["current_orders"][dish.id]["subtotal"]=currentQuantity*toy.price;
        }else{
            details["current_orders"][dish.id]={
                item:toy.toy_name,
                price:toy.price,
                quantity:1,
                subtotal:toy.price*1
            }
        }
        details.total_bill+=toy.price;

        firebase
        .firestore()
        .collection("users")
        .doc(doc.id)
        .update(details)
      })

    },
    HandleMarkerLost:function(){
        var button = document.getElementById("button-div");
        button.style.display="none"
    },
    askUserId:function(){
        var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
        swal({
            icon:iconUrl,
            title:"Welcome To TOYMANIA",
            content:{
                element:"input",
                attributes:{placeholder:"type your user id ",type:"number",min:1}
            },
            closeOnClickOutside:false
        }).then(inputValue=>{
            userId=inputValue;
        })
      },
    getToys:async function(){
        return await firebase
                     .firestore()
                     .collection("toys")
                     .get()
                     .then(snap=>{
                        return snap.docs.map(doc=>doc.data())
                     })
    }
})