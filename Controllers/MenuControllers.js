const {MainMenu, SideMenu} = require('../models/MenuSchema')


// ======================================== main menu controllers =================================

const addMainMenu = async (req, res) => {
    try {
        const { name, href, order, subItems } = req.body;

        // Check if the menu with the same name already exists
        const menuExist = await MainMenu.findOne({ name: name });
        if (menuExist) {
            return res.status(409).json({ error: "Menu already exists" });
        }

        // Check if the order value is already in use
        const orderExist = await MainMenu.findOne({ order: order });
        if (orderExist) {
            // Shift the order values of the existing items
            await MainMenu.updateMany(
                { order: { $gte: order } },
                { $inc: { order: 1 } }
            );
        }

        // Create and save the new menu
        const menu = new MainMenu({ name, href, order, subItems });
        await menu.save();
        res.status(201).json({ message: "Added successfully" });
    } catch (error) {
        return res.status(422).json({ error: "Oops, something went wrong" });
    }
};

const modifyMainMenu = async (req, res) => {
    try {
        const { _id, name, href, order, subItems } = req.body;

        const existingMenu = await MainMenu.findById(_id);
        if (!existingMenu) {
            return res.status(404).json({ error: "Menu not found" });
        }

        // Check if the new order value is different and adjust order values if needed
        if (order !== existingMenu.order) {
            const orderExist = await MainMenu.findOne({ order: order });
            if (orderExist) {
                // Update the order of other menus to make space for the new order
                await MainMenu.updateMany(
                    { order: { $gte: order } },
                    { $inc: { order: 1 } }
                );
            }
        }

        existingMenu.name = name;
        existingMenu.href = href;
        existingMenu.order = order;
        existingMenu.subItems = subItems;
        await existingMenu.save();

        res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(422).json({ error: "Oops, something went wrong" });
    }
};

const reorderMainMenu = async (req, res) => {
    try {
        const { menuId, newOrder } = req.body;

        // Find the menu to update
        const menuToMove = await MainMenu.findById(menuId);
        if (!menuToMove) {
            return res.status(404).json({ message: "Menu not found" });
        }

        // Update the order of the menu
        await MainMenu.updateMany(
            { order: { $gte: newOrder } },
            { $inc: { order: 1 } }
        );

        menuToMove.order = newOrder;
        await menuToMove.save();

        res.status(200).json({ message: "Menu reordered successfully" });
    } catch (error) {
        res.status(422).json({ message: "An error occurred", error: error.message });
    }
};

const deleteMainMenu = async (req, res) => {
    try {
        const { _id } = req.body;

        // Find the menu to delete
        const menuToDelete = await MainMenu.findById(_id);
        if (!menuToDelete) {
            return res.status(404).json({ error: "Menu not found" });
        }

        // Get the order of the menu to delete
        const deleteOrder = menuToDelete.order;

        // Delete the menu
        await MainMenu.findByIdAndDelete(_id);

        // Rearrange the order of the remaining menus
        await MainMenu.updateMany(
            { order: { $gt: deleteOrder } },
            { $inc: { order: -1 } }
        );

        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        return res.status(422).json({ error: "Oops, something went wrong" });
    }
};

const ViewMainMenu = async (req, res) => {
    try {
        // Find and sort the main menu items by the 'order' field
        const data = await MainMenu.find().sort({ order: 1 });

        res.status(200).json({ data });
    } catch (error) {
        return res.status(422).json({ error: "Oops, something went wrong" });
    }
};

// ======================================== side menu controllers =================================

const addSideMenu = async (req, res) => {
    try {
        const { name, href, order, subItems } = req.body;

        // Check if the menu with the same name already exists
        const menuExist = await SideMenu.findOne({ name: name });
        if (menuExist) {
            return res.status(409).json({ error: "Menu already exists" });
        }

        // Check if the order value is already in use
        const orderExist = await SideMenu.findOne({ order: order });
        if (orderExist) {
            // Shift the order values of the existing items
            await SideMenu.updateMany(
                { order: { $gte: order } },
                { $inc: { order: 1 } }
            );
        }

        // Create and save the new menu
        const menu = new SideMenu({ name, href, order, subItems });
        await menu.save();
        res.status(201).json({ message: "Added successfully" });
    } catch (error) {
        return res.status(422).json({ error: "Oops, something went wrong" });
    }
};

const modifySideMenu = async (req, res) => {
    try {
        const { _id, name, href, order, subItems } = req.body;

        const existingMenu = await SideMenu.findById(_id);
        if (!existingMenu) {
            return res.status(404).json({ error: "Menu not found" });
        }

        // Check if the new order value is different and adjust order values if needed
        if (order !== existingMenu.order) {
            const orderExist = await SideMenu.findOne({ order: order });
            if (orderExist) {
                // Update the order of other menus to make space for the new order
                await SideMenu.updateMany(
                    { order: { $gte: order } },
                    { $inc: { order: 1 } }
                );
            }
        }

        existingMenu.name = name;
        existingMenu.href = href;
        existingMenu.order = order;
        existingMenu.subItems = subItems;
        await existingMenu.save();

        res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(422).json({ error: "Oops, something went wrong" });
    }
};

const reorderSideMenu = async (req, res) => {
    try {
        const { menuId, newOrder } = req.body;

        // Find the menu to update
        const menuToMove = await SideMenu.findById(menuId);
        if (!menuToMove) {
            return res.status(404).json({ message: "Menu not found" });
        }

        // Update the order of the menu
        await SideMenu.updateMany(
            { order: { $gte: newOrder } },
            { $inc: { order: 1 } }
        );

        menuToMove.order = newOrder;
        await menuToMove.save();

        res.status(200).json({ message: "Menu reordered successfully" });
    } catch (error) {
        res.status(422).json({ message: "An error occurred", error: error.message });
    }
};

const deleteSideMenu = async (req, res) => {
    try {
        const { _id } = req.body;

        // Find the menu to delete
        const menuToDelete = await SideMenu.findById(_id);
        if (!menuToDelete) {
            return res.status(404).json({ error: "Menu not found" });
        }

        // Get the order of the menu to delete
        const deleteOrder = menuToDelete.order;

        // Delete the menu
        await SideMenu.findByIdAndDelete(_id);

        // Rearrange the order of the remaining menus
        await MainMenu.updateMany(
            { order: { $gt: deleteOrder } },
            { $inc: { order: -1 } }
        );

        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        return res.status(422).json({ error: "Oops, something went wrong" });
    }
};

const ViewSideMenu = async (req, res) => {
    try {
        // Find and sort the main menu items by the 'order' field
        const data = await SideMenu.find().sort({ order: 1 });

        res.status(200).json({ data });
    } catch (error) {
        return res.status(422).json({ error: "Oops, something went wrong" });
    }
};

module.exports = {addMainMenu, modifyMainMenu, reorderMainMenu, deleteMainMenu, ViewMainMenu, addSideMenu,
    modifySideMenu, reorderSideMenu, deleteSideMenu, ViewSideMenu
}