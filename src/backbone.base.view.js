var _ = global._,
    Backbone = global.Backbone;

//BaseView: takes care of subviews management and basic rendering
// If your model is in fact a collection (this.collection), then extend BaseCollectionView!
var BaseView = Backbone.View.extend({

    initialize: function(options) {
        this.options = options;
        this.subviews = {};
        this.selectors = {};

        this._attachModelListener();
    },

    /* Override if you want to return a custom view model for the template.
     * The result of the serialize becomes the "model" attribute of the ViewModel
     * passed to the template
     */
    serialize: function() {
        var outcome = {};
        if(!this.model && !this.collection) return outcome;

        //if we've both a model AND a collection, we return an aggregate
        if(this.model && this.collection) {
            outcome = {
                model: this.model.toJSON(),
                collection: this.collection.toJSON()
            };
        } else if(this.model) {
            outcome = { model: this.model.toJSON() };
        } else if(this.collection) {
            outcome = { collection: this.collection.toJSON() };
        }
        return outcome;
    },

    /* Override this if you want to "augment" the viewmodel passed to the template
     * Here you have a chance to augment/modify the complete ViewModel before it's passed to the template
     * the viewmodel will have a 'model'/'collection' property OR both (see serialize())
     */
    augmentViewModel: function(viewModel) {
        return viewModel;
    },

    render: function() {
        if(_.isFunction(this.beforeRender)) {
            this.beforeRender();
        }

        this.$el.html( this.template( this.augmentViewModel(this.serialize()) ) );

        //then, we render the subviews, if any (override that method to do your stuff)
        this.renderSubviews();

        if(_.isFunction(this.afterRender)) {
            this.afterRender();
        }

        return this;
    },

    //override this function if your view provides subviews
    renderSubviews: function() {
        return this;
    },

    remove: function() {
        //clean subviews
        this.cleanSubviews();
        Backbone.View.prototype.remove.apply(this, arguments);
    },

    /**
     *  This function store a subview and optionally renders it
        this.setSubview('tabbed-navigation', '.selector', view,  {render:true/false});

        @returns: the view passed in as argument (so we can chain a render)
        TODO: Check view recycling (what happens when I call setSubview with different names but referencing the same selector ?)
     */
    setSubview: function(name, selector, view) {
        var el;
        el = selector ? this.$(selector) : null;

        if(!el) {
            console.log("BaseView::Cannot set subview for '" + name + "'. Reason: selector '" + selector + "' didn't find any element.");
            return view;
        }

        //clean previous instance of this subview, if present
        //if there's already a view rendered in the selector, detach that view
        this.cleanSubview(name);
        this._detachSubviewFromSelector(selector);

        //index the view for later cleaning
        this.subviews[name] = view;
        //index also by selector
        this.selectors[selector] = view;

        el[0].set('html','').appendChild( view.render().el );
        return this;
    },

    getSubview: function(name){
        return this.subviews[name];
    },

    /**
     * Sibling of setSubview, but only limited to storing the view, without rendering or tracking
     * any insertion point for the view (like setSubview does)
     */
    storeSubview: function(name, view) {
        this.cleanSubview(name);
        this.subviews[name] = view;
    },

    cleanSubview: function(name) {
        if(!name || !this.subviews[name])  return;
        var selectors = this.selectors;
        var view = this.subviews[name];
        view.remove();
        delete this.subviews[name];
        //find this view in the selectors list and remove it
        _.filter(selectors, function(node, index) {
            if(node.id === view.id) {
                delete selectors[index];
                return true;
            }
            return false;
        });
        return this;
    },

    cleanSubviews: function() {
        var _this = this;
        try { _.each(this.subviews, function(sv,name) { _this.cleanSubview(name); }); } catch(safenet){}
    },

    _detachSubviewFromSelector: function(selector) {
        if(!this.selectors[selector]) return;

        var view = this.selectors[selector];
        view.remove();  //just detach the view from the DOM (without removing it)
        return this;
    },

    _attachModelListener: function() {
        if(this.model) this.listenTo(this.model, "change", this.render);
        if(this.collection) this.listenTo(this.collection, "change reset", this.render);
    }

});

module.exports = BaseView;