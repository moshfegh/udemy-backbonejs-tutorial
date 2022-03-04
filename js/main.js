var Vehicle = Backbone.Model.extend({
    validate: function(attrs){
        if (!attrs.registrationNumber)
            return "Registration number is required."
    },
    start: function(){
        console.log("Vehicle started.");
    }
});

var Vehicles = Backbone.Collection.extend({
    model: Vehicle
});

var VehicleView = Backbone.View.extend({
    tagName: "li",
    className: "vehicle",

    events: {
    	// A better name to use is "onClickDelete" because here you're trying to hook to the click event
    	// of the button. This helps differentiate between scenarios where a handler is used as a result of 
    	// a click event, from where it is used as a result of a collection event (eg onRemoveVehicle)
        "click .deleteVehicle": "onDeleteVehicle"
    },

    initialize: function(){
    	// The model of this view (Vehicle) doesn't publish the "remove" event. 
    	// The remove event is published by collections, not models, when an object
    	// is removed from them. 

        //this.model.on("remove", this.onDeleteVehicle, this);
    },

    // This function is called as a result of clicking the delete button. The argument to this method is not
    // a vehicle object. It's the standard jQuery event object. Read jQuery's click() function for details.
    // So remove the vehicle parameter. 
    onDeleteVehicle: function(vehicle){

		// You shouldn't do this. Here you're creating coupling between this view and the hondas collection.
		// This view should only know about its own model (Vehicle). It shouldn't be responsible for the 
		// hondas collection. It's the responsibility of VehiclesView to manage that.

        // var id = this.$el.attr("id");
        // hondas.remove(hondas.get({id: id}));
        // this.$el.remove();


        // This is all you need to do. When you remove the model, the view is automatically removed by Backbone.
        this.model.remove();
    },

    render: function(){
        this.$el.html(this.model.get("vehicleModel") + " " + this.model.get("registrationNumber") + " <button class='deleteVehicle'>Delete</button>");
        this.$el.attr("id", this.model.id);

        return this;
    }
});

var VehiclesView = Backbone.View.extend({
    tagName: "ul",

    initialize: function(){
        this.model.on("add", this.onAddVehicle, this);
    },

    onAddVehicle: function(vehicle){
        var vehicleView = new VehicleView({ model: vehicle });

        this.$el.append(vehicleView.render().$el);
    },

    render: function(){
        var self = this;

        this.model.each(function(vehicle){
            var vehicleView = new VehicleView({ model: vehicle });
            self.$el.append(vehicleView.render().$el);
        });
    }
});

var hondas = new Vehicles([
    new Vehicle({ id: 1, vehicleMake: "Honda", vehicleModel: "Accord", registrationNumber: "XLI887", color: "Blue"}),
    new Vehicle({ id: 2, vehicleMake: "Honda", vehicleModel: "Civic", registrationNumber: "ZNP123", color: "Blue"}),
    new Vehicle({ id: 3, vehicleMake: "Honda", vehicleModel: "CRV", registrationNumber: "XUV456", color: "Gray"})
]);

// The ID you have used here is misleading. It makes me think it's a template, whereas it's not. It's just a container. 
// A better name is "#vehicles". 
var vehiclesView = new VehiclesView({ el: "#vehicleTemplate", model: hondas });
vehiclesView.render();
