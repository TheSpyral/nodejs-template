exports.updateOrCreate = (model, where, dataUpdate) => {
  return model.findOne({ where }).then((item) => {
    if (!item) {
      return model.create(dataUpdate).then((item) => ({ item, created: true }));
    }

    return model
      .update(dataUpdate, { where })
      .then((item) => ({ item, created: false }));
  });
};
