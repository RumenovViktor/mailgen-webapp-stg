unlayer.registerPropertyEditor({
  name: 'blog-content-color-picker',
  layout: 'bottom',
  Widget: unlayer.createWidget({
    render(value) {
      return `
        <input class="color-value" value=${value} />
      `
    },
    mount(node, value, updateValue) {
      var input = node.getElementsByClassName('color-value')[0]
      input.onchange = function(event) {
        updateValue(event.target.value)
      }
    }
  })
});

unlayer.registerTool({
  type: 'whatever',
  category: 'contents',
  label: 'Content',
  icon: 'fa-blog',
  values: {
  },
  options: {
    default: {
      title: null,
    },
    text: {
      title: "Text",
      position: 1,
      options: {
        "color": {
          "label": "Color",
          "defaultValue": "#000",
          "widget": "blog-content-color-picker"
        }
      }
    }
  },
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        return `
          <div id="blogPostContainer" style="width: 30em;color: ${values.color};">
            <div class="blogPostItem" style="overflow:hidden;">
              <div>
                <h4>BLOG_POST_TITLE</h4>
              </div>
              <div>
                <p>BLOG_POST_DESCRIPTION</p>
              </div>
            </div>
          </div>
        `
      }
    }),
    exporters: {
      web: function(values) {
        return `
          <div id="blogPostContainer" style="width: 30em;color: ${values.color};">
            <div class="blogPostItem" style="overflow:hidden;">
              <div>
                <h4>BLOG_POST_TITLE</h4>
              </div>
              <div>
                <p>BLOG_POST_DESCRIPTION</p>
              </div>
            </div>
          </div>
        `
      },
      email: function(values) {
        return `
          <div id="blogPostContainer" style="width: 30em;color: ${values.color};">
            <div class="blogPostItem" style="overflow:hidden;">
              <div>
                <h4>BLOG_POST_TITLE</h4>
              </div>
              <div>
                <p>BLOG_POST_DESCRIPTION</p>
              </div>
            </div>
          </div>
        `
      }
    },
  },
});