# Backbone.base

Backbone.base is a collection of helper classes and common logic useful when developing backbone applications.
Specifically, this project contains:

- BaseView
<p>common view class implementing subviews management (adding/removal, lifecycle management)

- BaseModel/BaseCollection
<p>base model classes implementing safe(deep) cloning of attribute sets when exporting the viewmodel for the template (to avoid accidental tainting of the model)

## How to use it ##

Simply require backbone.base into your files. you'll get an aggregate object containing:

<pre>
{
	Model: (export of BaseModel class),
	Collection: (export of BaseCollection class),
	View: (export of BaseView class)
}
</pre>


## Using Backbone.base.View ##

The view class exported by backbone.base will give you automatic subview lifecycle management.
The view class automatically listen to changes in the model and renders; When instanced, the class can be provided with a 'model' or 'collection' attribute and will render (and listen for changes) accordingly; if both 'model' and 'collection' properties are provided, the view will listen for both of them.
The class exports also the following 'hooks' functions:

- serialize() : json
<p>this function automatically transform the model/collection (or both, if present) into a JSON aggregate ready for rendering into the template.
	If only a model is provided to the view, the outcome of this function will be a JSON object containing a 'model' property with the JSON representation of the model.
	If only a collection is provided to the view, the outcome of this function will be a JSON object containing a 'collection' property with the JSON representation for the collection.
	If both a 'model' and 'collection' are provided, the JSON object returned from this function will have both a 'model' and 'collection' properties.
	the outcome of this function is passed to the 'augmentViewModel' function;

- augmentViewModel(json) : json
<p>this function receive the JSON aggregate from 'serialize' and simply proxies it to the template. This hook is provided to allow the developer to 'augment' the view model before passing it to the template (useful if you want to add view helpers functions to the template).

The base view class provides also a few useful functions:

- renderSubviews
<p>this empty function is called at the end of the render cycle; it's useful if you want to render subviews into your template with the confidence of knowing that the markup will be there.

- setSubview(name, selector, view)
<p>this function lets you "add" a subview to your template, using the provided selector as the insertion point.
	the 'name' parameter is just a mnemonic you can use to later retrieve this view instance.
	the 'view' parameter is the instance of the view you want to add to the base view.
	This function will store the view into an internal lookup table and will render it.

- getSubview(name)
<p>lets you retrieve the view you previously added to the base view using 'setSubview'

- storeSubview(name, view)
<p>Useful if you want to just 'store' the subview into the internal lookup table, to take advantage of lifecycle management.


Internal functions not normally used by the developer (but still available if necessary) are:

- cleanSubview(name)
<p>Remove the subview identified by the provided name and clean its reference from the internal lookup table.

- cleanSubviews
<p>Remove all the subviews stored into the internal lookup table
