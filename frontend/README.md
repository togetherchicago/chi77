Dear future Chi77 developers - 
  Here is a guide which explains the design, and the reasoning
  behind the choices we have made,
  the immediate TODO's that should be taken care of once you get comfortable
  within the application, as well as the further optimizations that should get made.

  What is this application?
      This is a full-stack social service mapping application. It uses 
      the Javascript Leaflet library for the map, and React as a front end framework.


  Design + Design Choices:
      We built this in React for a couple of reasons. We chose to use a modern framework
      because it makes the code readable, scalable, and uses a MVC architecture.
      We chose React over Vue.js or Angular because the React-Leaflet library makes it very
      easy to work with Leaflet in React. The only other library that tried to do the same
      thing in Vue was much worse, and we struggled to make it work.

      We originally built this out in Raw Javascript, but saw that our codebase was getting 
      unneccesarily large, and extremely confusing.

      We are using Unstated(http://unstated.io/) for state management within the application,
      so our components can easily share information.

  Folder layout:
      All the frontend code lives in the frontend/ folder, and should remain that way. 
      Within frontend/

      frontend/
        - cyrpress/:
            cypress is used for frontend testing. We set it up to be used but never got
            around to using it.
        - node_modules/:
            all the external packages that we use. Built from frontend/package.json. Should
            only exist within frontend/, not within frontend/src
        - public/:
            this is where the index.html lives. Just leave it alone.
        - src/:
            this is where the all of the frontend code that we wrote lives. Further detailed below.
        - cypress.json: 
            config file for cypress. Does not need to be altered until you start using cypress.
        - Dockerfile:
            tells docker how to build the frontend
        - package.json:
            config file for requirements. This is what node_modules references when building.
        
  src/ breakdown:
      
        * components/: 
            this is where most of our code lives. 

            - navbar/:
                this component is the search/navbar at the top of the application screen. As of now, it has no functionality, and is just for show/scaffolding.
            - sidebar/:
                component for the sidebar, on left of the application screen. Code is commented within.
            - slider/:
                component for the slider which is used as a filter. Currently just used within sidebar/.
            LayerContainer.js:
                This is where our state management lives. If you are unfamiliar with state management,
                think of it as building Globals for the front end. Code is commented within.
            Map.js: 
                basic component which renders the underlying map

        *  data/:
            stores the geoJSON objects for census tracts, neighborhoods etc
            in the frontend, bc API was too slow.
        *  App.css:
            base css for the application
        *  App.js:
            this is the base component for the entire application, which includes
            the map, navbar, and sidebar. If you add other components to the map, not within 
            the sidebar or navbar, this is where they will go.
        *  App.test.js:
            this is where tests for App.js should live, but we never got around to writing any.
        *  index.css:
            css for index.js, but as you can see it really is almost empty.
        *  index.js:
            This is how React interacts with the DOM, rending App.js onto the DOM.
        * logo.svg:
            honestly not sure what it is
        *  registerServiceWorker.js:
            we didnt write this code, it came from somewhere, but looks important for production.


      Immediate TODOS:
        1. Add the ability to make calls to the population API for neighborhoods.
        2. Change how we make API calls, so we don't need to add cases each time an 
            API route becomes available. I documented where this would be within the 
            setFilter() function in LayerContainer.js.

      Other Todos:
        These are things that are more big picture, and not so much code changes.

        One thing we tried implementing was showing how data changes over time. For example,
        we could show how population changes over time, and display the delta as a different
        coloring. These led to a couple problems:
          1. The UI for this was very confusing and we struggled with the right way to do this.
          2. How to handle not having complete data. For example, we may only have years for 2015, 2017,2018
             and not 2016.


        And thats all for the frontend code! Within all of the coding files I have included 
        (what i believe to be) thorough comments outlining everything. Good luck!