'use strict';
module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
    'Organization',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      defaultEventLogo: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      defaultEventBannerImage: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      defaultItemImage: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      headerLogoImage: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      signUpPageImage: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      eventListingSiteBanner: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      aboutUs: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false,
      },
      privacyPolicy: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false,
      },
      termOfService: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false,
      },
      transactionEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      notificationEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
    }, {});
  Organization.associate = function (models) {
    // associations can be defined here
  };
  return Organization;
};