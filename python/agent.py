from base_agent import BaseAgent
import numpy as np
# Do not modify this cell!

# Create empty TDAgent class.
# These methods will be filled in later cells.

class TDAgent(BaseAgent):
    def agent_init(self, agent_info={}):
        # Create a random number generator with the provided seed to seed the agent for reproducibility.
        self.rand_generator = np.random.RandomState(agent_info.get("seed"))

        # Policy will be given, recall that the goal is to accurately estimate its corresponding value function. 
        self.policy = agent_info.get("policy")
        # Discount factor (gamma) to use in the updates.
        self.discount = agent_info.get("discount")
        # The learning rate or step size parameter (alpha) to use in updates.
        self.step_size = agent_info.get("step_size")
        # threshold for e-greedy policy
        self.epsilon = agent_info.get("epsilon")

        # Initialize an array of zeros that will hold the values.
        # Recall that the policy can be represented as a (# States, # Actions) array. With the 
        # assumption that this is the case, we can use the first dimension of the policy to
        # initialize the array for values.
        self.q = np.zeros((self.policy.shape))
        
    def agent_start(self, state):
        """The first method called when the episode starts, called after
        the environment starts.
        Args:
            state (Numpy array): the state from the environment's env_start function.
        Returns:
            The first action the agent takes.
        """
        # The policy can be represented as a (# States, # Actions) array. So, we can use 
        # the second dimension here when choosing an action.
        action = self.rand_generator.choice(range(self.policy.shape[1]), p=self.policy[state])
        self.last_state = state
        self.last_aciton = action
        self.steps = 1
        return action

    def agent_step(self, reward, state):
        """A step taken by the agent.
        Args:
            reward (float): the reward received for taking the last action taken
            state (Numpy array): the state from the
                environment's step after the last action, i.e., where the agent ended up after the
                last action
        Returns:
            The action the agent is taking.
        """
        if self.rand_generator.rand() < self.epsilon:
            action = self.rand_generator.choice(range(self.policy.shape[1]), p=self.policy[state])
        else:
            action = self.argmax(self.q[state, :])
        # Hint: We should perform an update with the last state given that we now have the reward and
        # next state. We break this into two steps. Recall for example that the Monte-Carlo update 
        # had the form: Q[S_t, A_t] = Q[S_t, A_t] + alpha * (target - Q[S_t, A_t]), where the target was the return, G_t.
        target = reward + self.q[state, action] * self.discount
        self.q[self.last_state, self.last_aciton] = self.q[self.last_state, self.last_aciton] + self.step_size * (target - self.q[self.last_state, self.last_aciton])

        # Having updated the value for the last state, we now act based on the current 
        # state, and set the last state to be current one as we will next be making an 
        # update with it when agent_step is called next once the action we return from this function 
        # is executed in the environment.

        self.last_aciton = action
        self.last_state = state
        self.steps += 1

        return action

    def agent_end(self, reward):
        """Run when the agent terminates.
        Args:
            reward (float): the reward the agent received for entering the terminal state.
        """
        # Hint: Here too, we should perform an update with the last state given that we now have the 
        # reward. Note that in this case, the action led to termination. Once more, we break this into 
        # two steps, computing the target and the update itself that uses the target and the 
        # current value estimate for the state whose value we are updating.
        target = reward
        self.q[self.last_state, self.last_aciton] = self.q[self.last_state, self.last_aciton] + self.step_size * (target - self.q[self.last_state, self.last_aciton])

    def agent_cleanup(self):
        """Cleanup done after the agent ends."""
        self.last_state = None
        self.last_aciton = None
        self.steps = 0
        
    def agent_message(self, message):
        """A function used to pass information from the agent to the experiment.
        Args:
            message: The message passed to the agent.
        Returns:
            The response (or answer) to the message.
        """
        if message == "get_values":
            return self.q
        elif message == "get_steps":
            return self.steps
        else:
            raise Exception("TDAgent.agent_message(): Message not understood!")
    
    def argmax(self, q_values):
        """argmax with random tie-breaking
        Args:
            q_values (Numpy array): the array of action-values
        Returns:
            action (int): an action with the highest value
        """
        top = float("-inf")
        ties = []

        for i in range(len(q_values)):
            if q_values[i] > top:
                top = q_values[i]
                ties = []

            if q_values[i] == top:
                ties.append(i)

        return self.rand_generator.choice(ties)
