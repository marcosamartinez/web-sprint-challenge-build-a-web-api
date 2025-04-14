// Write your "actions" router here!
// Write your "actions" router here!
const express = require("express");
const router = express.Router();

// Import actions model:
const Actions = require("./actions-model");
const {
  validateActionId,
  validateActionInput,
  validateProjectId,
  validateActionUpdate,
} = require("./actions-middleware");

router.get("/", async (req, res, next) => {
  try {
    const actions = await Actions.get();
    res.json(actions);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validateActionId, async (req, res) => {
  // If you're using validateActionId middleware, you should already have the action in req.action
  // No need to fetch it again
  res.json(req.action);
});

router.post(
  "/",
  validateActionInput,
  validateProjectId,
  async (req, res, next) => {
    try {
      const { notes, description, project_id } = req.body;
      const newActionReq = { description, notes, project_id };
      const newActionRec = await Actions.insert(newActionReq);
      res.status(201).json(newActionRec);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  validateActionId,
  validateActionInput,
  validateActionUpdate,
  async (req, res, next) => {
    try {
      const actionId = req.params.id;
      const { notes, description, project_id, completed } = req.body;
      const newActionReq = { notes, description, project_id, completed };
      const newActionRec = await Actions.update(actionId, newActionReq);
      res.json(newActionRec);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", validateActionId, async (req, res, next) => {
  try {
    const id = req.params.id;
    await Actions.remove(id);
    res.end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
