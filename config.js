var config = {}

config.deploy = {
  bucket: 'apps.texastribune.org',
  key: '2016-texas-primaries',
  profile: 'newsapps'
}

config.dataFolder = './data'
config.templateFolder = './app/templates'

config.data = {
  sheets: [
    {
      fileid: '14QaDOwboQmeNlzScnPeCYl26F1CYO6Jok4P091UTjSc',
      name: 'lists',
      copytext: {
        basetype: 'objectlist'
      }
    }
  ]
}

module.exports = config
