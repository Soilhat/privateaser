'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

function BookingPrice(){
  for (var i = 0; i < events.length; i++) {
    for (var j = 0; j < bars.length; j++){
      if (events[i].barId == bars[j].id) {
        events[i].price = (bars[j].pricePerHour*events[i].time+bars[j].pricePerPerson*events[i].persons)
      }
    }
  }
}

function GroupDiscount(){
  for (var i = events.length - 1; i >= 0; i--) {
    if (events[i].persons > 10) {
      if (events[i].persons > 20) {
        if(events[i].persons > 60) {
            events[i].price*=0.5
        }
        else
          events[i].price*=0.7
      }
      else
        events[i].price*=0.9
    }
  }
}

function Commission(){
  for (var i = events.length - 1; i >= 0; i--) {
    var commission = events[i].price*0.3
    events[i].commission.insurance = commission/2
    commission/=2
    events[i].commission.treasury = events[i].persons
    commission-=events[i].persons
    events[i].commission.privateaser = commission
  }
}

function Deductible(){
  events.forEach(function ded(event){
    if(event.options.deductibleReduction )
    event.price += event.persons
    event.commission.privateaser += event.persons
  })
}

function PayActors(){
  actors.forEach(function(actor){
    actor.payment.forEach(function(payment){
      var event = events.find(function(element){
        return element.id == actor.eventId
      })
      if(payment.who == "booker"){
        payment.amount = event.price
      }
      if(payment.who == "bar"){
        var commission = event.commission.insurance + event.commission.treasury + event.commission.privateaser
        payment.amount = event.price - commission
      }
      if(payment.who == "insurance"){
        payment.amount = event.commission.insurance
      }
      if(payment.who == "treasury"){
        payment.amount = event.commission.treasury
      }
      if(payment.who == "privateaser"){
        payment.amount = event.commission.privateaser
      }
    })
  })
}

BookingPrice(); //step 1
GroupDiscount(); //step 2
Commission(); //step 3
Deductible(); //step 4
PayActors(); //step 5

console.log(bars);
console.log(events);
console.log(actors);
