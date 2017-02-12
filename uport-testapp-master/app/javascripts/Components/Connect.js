/* eslint-env jquery, web3 */
import React from 'react'
import { Link } from 'react-router'
import { Registry } from 'uport-lib'
import { web3 } from '../web3setup.js'

export default class Connect extends React.Component {
  constructor (props) {
    super(props)
    this.connect = this.connect.bind(this)
    this.state = {
      address: null,
      error: null,
      personaAttributes: null
    }
  }

  componentDidUpdate () {
    let self = this

    if (this.state.address && !this.state.personaAttributes) {

      const personaRegistry = new Registry({ web3: web3.currentProvider})

      personaRegistry.getPublicProfile(this.state.address).then(profile => {
        console.log(profile)
        self.setState({ personaAttributes: profile })
        $('#attributeName').text(profile.name)
        if (profile.image !== undefined) {
          let imgUrl = 'https://ipfs.infura.io' + profile.image.contentUrl
          $('#avatarImg').attr('src', imgUrl)
          $('#avatarDiv').show()
        }
        if (profile.description !== undefined) {
          $('#attributeDescriptionRow').show()
          $('#attributeDescription').text(profile.description)
        }

        if (profile.location !== undefined) {
          $('#attributeLocationRow').show()
          $('#attributeLocation').text(profile.location)
        }
      })

      $('#connect').hide()
      $('#address').text(this.state.address)
      $('#success').show()
    }
    if (this.state.error) {
      $('#connect').hide()
      $('#error').text(this.state.error)
      $('#errorDiv').show()
    }
  }

  connect () {
    let self = this
    web3.eth.getCoinbase(function (error, address) {
      if (error) { throw error }
      web3.eth.defaultAccount = address
      self.setState({address: address})
    })
  }

  render () {
    let attributesTable = (
      <table style={{color: '#2092ED'}}>
        <tbody>
          <tr>
            <td style={{textAlign: 'right'}}><strong>uPort Id:</strong></td>
            <td><span id='address' /></td>
          </tr>
          <tr>
            <td style={{textAlign: 'right'}}><strong>Name:</strong></td>
            <td><span id='attributeName' /></td>
          </tr>
          <tr id='attributeDescriptionRow' style={{display: 'none'}}>
            <td style={{textAlign: 'right'}}><strong>I am:</strong></td>
            <td><span id='attributeDescription' /></td>
          </tr>
          <tr id='attributeLocationRow' style={{display: 'none'}}>
            <td style={{textAlign: 'right'}}><strong>Location:</strong></td>
            <td><span id='attributeLocation' /></td>
          </tr>
        </tbody>
      </table>
    )

    return (
      <div className='container centered' style={{maxWidth: '480px'}}>

        <div class="mb-xl">
          &nbsp;
          <h2 class="text-info">Seahorse.</h2>
          <p class="typography-subheading">The basic idea behind this prototype is to store the right to be forgotten setting for personal data management <a href="http://seahorse.alvis.io" target="_blank" class="text-info">Seahorse</a>.</p>

        </div>

        <div id='connect'>
          <button className='btn bigger' onClick={this.connect} type='submit'>Seahorse identification</button>
        </div>

        <div id='success' style={{display: 'none'}}>
          <h3>Success! You have connected your uPort identity.</h3>
          <table className='persona'>
            <tbody>
              <tr>
                <td className='avatar'>
                  <div id='avatarDiv' style={{display: 'none'}}>
                    <img id='avatarImg' style={{maxWidth: '200px'}} />
                  </div>
                </td>
                <td>{attributesTable}</td>
              </tr>
            </tbody>
          </table>
          <Link to='sign'>
            <button className='btn bigger' type='submit'>Continue</button>
          </Link>
        </div>

        <div id='success_old' style={{display: 'none'}}>
          <h3>Success! You have connected your uPort identity.</h3>
          <table className='persona'>
            <tbody>
              <tr>
                <td className='avatar'>
                  <div id='avatarDiv' style={{display: 'none'}}>
                    <img id='avatarImg' style={{maxWidth: '200px'}} />
                  </div>
                </td>
                <td>{attributesTable}</td>
              </tr>
            </tbody>
          </table>
          <Link to='sign'>
            <button className='btn bigger' type='submit'>Continue</button>
          </Link>
        </div>

        <div id='errorDiv' style={{display: 'none'}}>
          <h3>Error! You have NOT connected your uPort identity.</h3>
          <p><strong>Error:</strong><span id='error' style={{display: 'inline-block', marginLeft: '10px'}} /> </p>
        </div>

        <div id='errorDiv_old' style={{display: 'none'}}>
          <h3>Error! You have NOT connected your uPort identity.</h3>
          <p><strong>Error:</strong><span id='error' style={{display: 'inline-block', marginLeft: '10px'}} /> </p>
        </div>

      </div>
    )
  }
}

Connect.propTypes = { web3: React.PropTypes.object }
