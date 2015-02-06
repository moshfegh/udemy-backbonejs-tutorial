
// In the first few sections, we do all the coding here.
// Later, you'll see how to organize your code into separate
// files and modules.

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
        "click .deleteVehicle": "onDeleteVehicle"
    },

    initialize: function(options){
        this.model.on("remove", this.onDeleteVehicle, this);
        this.bus = options.bus;
        this.bus.on("addRegisteredVehicle", this.onAddRegisteredVehicle, this);
    },

    onDeleteVehicle: function(){
        // var id = this.$el.attr("id");
        // hondas.remove(hondas.get(id));
        // this.$el.remove();
        hondas.remove(this.model);
        this.remove();
    },

    onAddRegisteredVehicle: function(vehicle){
        this.model = vehicle;
        this.render();
    },

    render: function(){
        this.$el.html(this.model.get("vehicleModel") + " " + this.model.get("registrationNumber") + " <button class='deleteVehicle'>Delete</button>");
        this.$el.attr("id", this.model.id);

        return this;
    }
});

var NewVehicleView = Backbone.View.extend({
    events: {
        "click #add-vehicle": "onAddNewVehicle"
    },

    initialize: function(options){
        this.bus = options.bus;
    },

    onAddNewVehicle: function(){
        var NewVehicleRegistration = $('#new-vehicle-registration').val();
        var newHonda = new Vehicle({ registrationNumber: NewVehicleRegistration});
        this.bus.trigger("addRegisteredVehicle", newHonda);
    },

    render: function(){
        this.$el.html("<input id='new-vehicle-registration' type='text' placeholder='Registration Number' /><button id='add-vehicle'>Add Vehicle</button>");
        return this;
    }
});

var VehiclesView = Backbone.View.extend({
    tagName: "ul",

    initialize: function(options){
        this.model.on("add", this.onAddVehicle, this);
        this.bus = options.bus;
    },

    // onAddVehicle: function(vehicle){
    //     debugger;
    //     var vehicleView = new VehicleView({ model: vehicle });

    //     this.$el.append(vehicleView.render().$el);
    // },

    render: function(){
        var self = this;
        this.model.each(function(vehicle){
            var vehicleView = new VehicleView({ model: vehicle, bus: self.bus });
            self.$el.append(vehicleView.render().$el);
        });
    }
});

bus = _.extend({}, Backbone.Events);

var hondas = new Vehicles([
    new Vehicle({ id: 1, vehicleMake: "Honda", vehicleModel: "Accord", registrationNumber: "XLI887", color: "Blue"}),
    new Vehicle({ id: 2, vehicleMake: "Honda", vehicleModel: "Civic", registrationNumber: "ZNP123", color: "Blue"}),
    new Vehicle({ id: 3, vehicleMake: "Honda", vehicleModel: "CRV", registrationNumber: "XUV456", color: "Gray"})
]);

var vehiclesView = new VehiclesView({ el: "#vehicleTemplate", model: hondas, bus:bus });
vehiclesView.render();

var newVehiclesView = new NewVehicleView({ el: "#addVehicleTemplate", bus: bus});
newVehiclesView.render();




