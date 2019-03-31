context('TODO List', () => {
  beforeEach(() => {
    cy.visit('http://qa-challenge.gopinata.com/')

    cy.get('body').then($element => {
      if ($element.find("[type='checkbox']").length > 0) {

        cy.get('.todo-list li')
          .each(function($el, index, $list){
            $el.find('.destroy').click()
          })
      }
    })
  })

  it('User is able to add an item into the TODOs list', () => {
    var max = 30
    var min = 5
    var text = ''
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !@#$%^&*()_+=-`~{}[]ñ|\':;/.,<>?"
    var random = Math.floor(Math.random() * (max - min)) + min

    for (var i = 0; i < random; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length))

    cy.get('.new-todo')
      .type(text).should('have.value', text)
      .type('{enter}')

    cy.get('.todo-list').find('label')
      .should('have.length', 1)
      .should('have.text', text)
  })

  it('XSS verification', () => {
    var text = "<script>alert('hello there');</script>"

    const stub = cy.stub()
    cy.on ('window:alert', stub)

    cy.get('.new-todo')
      .type(text).should('have.value', text)
      .type('{enter}')
      .then(() => {
        expect(stub.getCall(0)).to.be.null
      })

    cy.get('.todo-list').find('label')
      .should('have.length', 1)
      .should('have.text', text)
  })

  it('Digits are allowed and correctly displayed in the tasks', () => {
    cy.get('.new-todo')
      .type('123').should('have.value', '123')
      .type('{enter}')

    cy.get('.todo-list').find('label')
      .should('have.length', 1)
      .should('have.text', '123')
  })

  it('Special characters are allowed and correctly displayed in the tasks', () => {
    cy.get('.new-todo')
      .type('!@#$%^&*()_+`~=-{}|][";:?><,./\'\\').should('have.value', '!@#$%^&*()_+`~=-{}|][";:?><,./\'\\')
      .type('{enter}')

    cy.get('.todo-list').find('label')
      .should('have.length', 1)
      .should('have.text', '!@#$%^&*()_+`~=-{}|][";:?><,./\'\\')
  })

  it('User is able to mark an item as completed', () => {
    cy.get('.new-todo')
      .type('coffee!').should('have.value', 'coffee!')
      .type('{enter}')

    cy.get('.todo-list').find('[type=\'checkbox\']')
      .check().should('be.checked')

    cy.get('.todo-list')
      .find('.completed')
        .find('label')
          .should('have.text', 'coffee!')
  })

  it('User is able to remove completed items', () => {
    cy.get('.new-todo')
      .type('coffee!').should('have.value', 'coffee!')
      .type('{enter}')

    cy.get('.todo-list').find('[type=\'checkbox\']')
      .check().should('be.checked')

    cy.get('.clear-completed')
      .click()

    cy.get('.todo-list').find('label')
      .each(($el, index, $list) => {
        expect($list).to.have.length(0)
      })
  })

  it('Only tasks with text are allowed', () => {
    cy.get('.new-todo')
      .click()
      .type('{enter}')

    cy.get('.todo-list').find('label')
      .should('have.length', 0)
  })

  it('Verify that long text is displayed inside the label box', () => {
    let before
    let after

    cy.document()
      .then((doc) => {
        before = doc.documentElement.scrollWidth
      })
      .then(() =>
        cy.get('.new-todo')
          .type('qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty .123 qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty qwerty  .123!')
          .type('{enter}')
            .then(() => {
              cy.document()
              .then((doc) => {
                after = doc.documentElement.scrollWidth
                expect(before).to.equal(after)
              })
            })
      )
  })

  it('Verify item count', () => {
    cy.get('.new-todo')
      .type('coffee!').should('have.value', 'coffee!')
      .type('{enter}')
      .type('hamburgers').should('have.value', 'hamburgers')
      .type('{enter}')
      .type('asado').should('have.value', 'asado')
      .type('{enter}')

    cy.get('.todo-count')
      .should('have.text', '3 items left')
  })

  it('Verify filter: completed items', () => {
    cy.get('.new-todo')
      .type('item 1').should('have.value', 'item 1')
      .type('{enter}')
      .type('item 2').should('have.value', 'item 2')
      .type('{enter}')
      .type('item 3').should('have.value', 'item 3')
      .type('{enter}')

    cy.get('.todo-list').find('[type=\'checkbox\']').first()
      .check().should('be.checked')

    cy.get('.filters li').contains('Completed')
      .click()

    cy.get('.todo-list').find('label')
      .should('have.length', 1)
  })

  it('Verify filter: active items', () => {
    cy.get('.new-todo')
      .type('item 1').should('have.value', 'item 1')
      .type('{enter}')
      .type('item 2').should('have.value', 'item 2')
      .type('{enter}')
      .type('item 3').should('have.value', 'item 3')
      .type('{enter}')

    cy.get('.todo-list').find('[type=\'checkbox\']').first()
      .check().should('be.checked')

    cy.get('.filters li').contains('Active')
      .click()

    cy.get('.todo-list').find('label')
      .should('have.length', 2)
  })

  it('Verify that all items are completed when they are marked as completed', () => {
    cy.get('.new-todo')
      .type('item 1').should('have.value', 'item 1')
      .type('{enter}')
      .type('item 2').should('have.value', 'item 2')
      .type('{enter}')
      .type('item 3').should('have.value', 'item 3')
      .type('{enter}')

    cy.get('.todo-list').find('[type=\'checkbox\']')
      .check().should('be.checked')

    cy.get('.todo-count')
      .should('have.text', 'No items left')
  })

  it('User is able to edit an option', () => {
    cy.get('.new-todo')
      .type('coffee!').should('have.value', 'coffee!')
      .type('{enter}')

    cy.get('.todo-list').find('label')
      .dblclick()

    cy.get('.todo-list').find('.editing').find('.edit')
      .clear()
      .type('a lot of coffee!').should('have.value', 'a lot of coffee!')
      .type('{enter}')

    cy.get('.todo-list').find('label')
      .should('not.have.text', 'coffee!')

    cy.get('.todo-list').find('label')
      .should('have.text', 'a lot of coffee!')
  })

  it('Verify that the label is the same on view mode and edit mode', () => {
    cy.get('.new-todo')
      .type('a   lot    of     space')
      .type('{enter}')

    cy.get('.todo-list').find('label')
      .should('have.text', 'a' + '\xa0\xa0\xa0' + 'lot' + '\xa0\xa0\xa0\xa0' + 'of' + '\xa0\xa0\xa0\xa0\xa0' + 'space')

    cy.get('.todo-list').find('label')
      .dblclick()

    cy.get('.todo-list').find('.editing').find('.edit')
      .should('have.value', 'a' + '\xa0\xa0\xa0' + 'lot' + '\xa0\xa0\xa0\xa0' + 'of' + '\xa0\xa0\xa0\xa0\xa0' + 'space')
  })

  // LOAD TEST:
  // it('Add 1000 elements and verify the user can remove items', () => {
  //   var number = 0;
  //   var max = 1000
  //   var min = 0

  //   while (number < max) {
  //     cy.get('.new-todo')
  //     .type(number)
  //     .type('{enter}')

  //     cy.get('.todo-count')
  //       .should('contain', (number + 1).toString())

  //     number++
  //   }

  //   var random = Math.floor(Math.random() * (max - min)) + min

  //   cy.log(random)

  //   cy.get('.todo-list').find('[type=\'checkbox\']')
  //     .eq(random)
  //     .check().should('be.checked')
  // })
})
