unlayer.registerTool({
  name: 'unsubscribe_text',
  label: 'Unsubscribe',
  icon: 'fa-ban',
  supportedDisplayModes: ['web', 'email'],
  options: {
    colors: { // Property Group
      title: "Colors", // Title for Property Group
      position: 1, // Position of Property Group
      options: {
        "textColor": { // Property: textColor
          "label": "Text Color", // Label for Property
          "defaultValue": "#FFF",
          "widget": "color_picker" // Property Editor Widget: color_picker
        }
      }
    }
  },
  values: {},
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        return `
        <!--START UNSUBSCRIBE-->
        <div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">
            <span>No longer interested?</span><a href="http://google.com">Unsubscribe</a>
        </div>
        <!--END UNSUBSCRIBE-->
        `
      }
    }),
    exporters: {
      web: function(values) {
        return `
        <!--START UNSUBSCRIBE-->
        <div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">
            <span>No longer interested?</span><a href="http://google.com">Unsubscribe</a>
        </div>
        <!--END UNSUBSCRIBE-->
        `
      },
      email: function(values) {
        return `
        <!--START UNSUBSCRIBE-->
        <div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">
            <span>No longer interested?</span><a href="http://google.com">Unsubscribe</a>
        </div>
        <!--END UNSUBSCRIBE-->
        `
      }
    }
  },
  validator(data) {
    const { defaultErrors, values } = data;
    return [];
  },
});