from base_environment import BaseEnvironment 
import functools
import numpy as np
# Do not modify this cell!

# Create empty GridEnvironment class.
# These methods will be filled in later cells.
class GridEnvironment(BaseEnvironment):
    def env_init(self, env_info={}):
        """Setup for the environment called when the experiment first starts.
        Note:
            Initialize a tuple with the reward, first state, boolean
            indicating if it's terminal.
        """
        
        # Note, we can setup the following variables later, in env_start() as it is equivalent. 
        # Code is left here to adhere to the note above, but these variables are initialized once more
        # in env_start() [See the env_start() function below.]
        
        reward = None
        state = None # See Aside
        termination = None
        self.reward_state_term = (reward, state, termination)
        
        # AN ASIDE: Observation is a general term used in the RL-Glue files that can be interachangeably 
        # used with the term "state" for our purposes and for this assignment in particular. 
        # A difference arises in the use of the terms when we have what is called Partial Observability where 
        # the environment may return states that may not fully represent all the information needed to 
        # predict values or make decisions (i.e., the environment is non-Markovian.)
        
        # Set the default height to 4 and width to 12 (as in the diagram given above)
        self.grid_size = env_info.get("grid_size", 3) 
        self.grid_length = env_info.get("grid_length", 9)
        self.grid = env_info.get("grid")
        self.grid_state = env_info.get("grid_state")
        # define env info here
        
        # Take a look at the annotated environment diagram given in the above Jupyter Notebook cell to 
        # verify that your understanding of the above code is correct for the default case, i.e., where 
        # height = 4 and width = 12.

    def env_start(self):
        state = self.state()
        self.reward_state_term = (0, state, False)
        return state


    def env_step(self, action):
        reward = -1
        is_terminal = False
        self.grid_state[action] = not self.grid_state[action]
        if np.array_equal(self.grid_state, np.ones(self.grid_length)):
            is_terminal = True 
        self.reward_state_term = (reward, self.state(), is_terminal)
        return self.reward_state_term
    def env_end(self, reward):
        raise NotImplementedError
        
    def env_cleanup(self, reward):
        self.grid_state = np.zeros(self.grid_length)
    
    def env_message(self, message):
        if message == "get_grid_state":
            return self.grid_state
    # helper method
    def state(self):
        return functools.reduce(lambda prev, cur: (prev << 1) | cur, self.grid_state,0)


def test_state():
    env = GridEnvironment()
    env.env_init({
        "grid_size": 3, 
        "grid_length": 9, 
        "grid": [1, 1, 1, 1, 0, 1, 1, 1 , 1 ],
        })
    state_to_test =  [1, 0, 0, 1, 0, 0, 0, 0, 1]
    true_state = 256 + 1 + 32
    output_state = env.state(state_to_test)
    assert(true_state == output_state)
    print(output_state)

def test_action():
    env = GridEnvironment()
    env.env_init({
        "grid_size": 3, 
        "grid_length": 9, 
        "grid": [1, 1, 1, 1, 0, 1, 1, 1 , 1 ],
        "grid_state": [1, 0, 0, 1, 0, 0, 0, 0, 1],
        })
    true_state = (-1, 256 + 1 + 32 + 128, False)
    output_state = env.env_step(1)
    assert(true_state == output_state)


# test_action()
