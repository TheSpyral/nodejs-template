'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      defaultEventLogo: {
        type: Sequelize.STRING
      },
      defaultEventBannerImage: {
        type: Sequelize.STRING
      },
      defaultItemImage: {
        type: Sequelize.STRING
      },
      headerLogoImage: {
        type: Sequelize.STRING
      },
      signUpPageImage: {
        type: Sequelize.STRING
      },
      eventListingSiteBanner: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      aboutUs: {
        type: Sequelize.TEXT
      },
      privacyPolicy: {
        type: Sequelize.TEXT
      },
      termOfService: {
        type: Sequelize.TEXT
      },
      transactionEmail: {
        type: Sequelize.STRING
      },
      notificationEmail: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Organizations');
  }
};